'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as signalR from '@microsoft/signalr';
import { Card, Button, Space, Spin, Modal, message, Tag, Divider, Typography } from 'antd';
import { getAttempt, saveAnswer, completeAttempt } from '@/services/attemptService';
import type { AttemptDto } from '@/types/attempt';

const { Title, Text, Paragraph } = Typography;

function unwrapParams<T extends Record<string, any>>(params: T | Promise<T>): T {
  // @ts-ignore
  const maybeUse = (React as any).use;
  if (typeof maybeUse === 'function') {
    // @ts-ignore
    return maybeUse(params);
  }
  return params as T;
}

export default function AttemptRunner({ params }: { params: { attemptId?: string } | Promise<{ attemptId?: string }> }) {
  const resolvedParams = unwrapParams(params as any);
  const rawId = resolvedParams?.attemptId;
  const attemptId = rawId ? Number(rawId) : NaN;

  const router = useRouter();

  useEffect(() => {
    if (!rawId || Number.isNaN(attemptId)) {
      Modal.error({
        title: 'Invalid Attempt URL',
        content: 'Attempt id missing or invalid in the URL. Please open the correct attempt link.',
        onOk: () => router.replace('/student/tests'),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawId]);

  const [attempt, setAttempt] = useState<AttemptDto | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selectedOptionId?: number; marked?: boolean }>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // signalr
  const hubRef = useRef<signalR.HubConnection | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const autosaveRef = useRef<number | null>(null);

  // guards & state refs
  const hasStartedRef = useRef<boolean>(false);
  const loadedRef = useRef<boolean>(false);
  const didSubmitRef = useRef<boolean>(false);
  const lockedAfterIndexRef = useRef<number | null>(null); // once set, cannot go back to indices <= this
  const initialMoveDoneRef = useRef<boolean>(false);

  // duration ref (persisted for timer guards)
  const durationRef = useRef<number>(0);

  // helper: try to parse server date, assume UTC if no timezone provided
  const parseServerDate = (s: string | undefined | null): Date | null => {
    if (!s) return null;
    if (/[zZ]|[+\-]\d{2}:\d{2}$/.test(s)) {
      return new Date(s);
    }
    try {
      // assume server sent UTC if no zone part
      return new Date(s + 'Z');
    } catch {
      return new Date(s);
    }
  };

  // ---------- Load attempt ----------
  useEffect(() => {
    if (Number.isNaN(attemptId)) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      try {
        const data = await getAttempt(attemptId);
        if (!mounted) return;
        console.log('[ATTEMPT] loaded', data);

        // store attempt object returned by server into state
        setAttempt(data);
        setQuestions(data.questions || []);

        // store duration in ref for later timer guards
        const duration = Number(data.durationMinutes ?? 0);
        durationRef.current = duration;
        console.log('[ATTEMPT] server durationMinutes=', duration);

        // build answers map if server returned savedAnswers
        if (data.savedAnswers && Array.isArray(data.savedAnswers)) {
          const map: Record<number, any> = {};
          for (const sa of data.savedAnswers) {
            map[sa.questionId] = { selectedOptionId: sa.selectedOptionId ?? undefined, marked: !!sa.isMarkedForReview };
          }
          setAnswers(map);
        }

        // determine if started (prefer explicit startedAt)
        const hasStarted = Boolean(data.startedAt) || String(data.status || '').toLowerCase().includes('inprogress');
        hasStartedRef.current = hasStarted;

        // compute timer only if we have positive duration AND a start time
        const startedAtStr = data.startedAt ?? data.attemptedOn ?? null;
        const startedAt = parseServerDate(startedAtStr);

        console.log('[ATTEMPT] parsed startedAtStr=', startedAtStr, 'parsed date=', startedAt, 'duration=', duration);

        if (duration > 0 && startedAt) {
          const end = new Date(startedAt.getTime() + duration * 60000);
          const now = new Date();
          console.log('[ATTEMPT] start, end, now:', startedAt.toISOString(), end.toISOString(), now.toISOString());
          const secs = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
          setTimeLeftSec(secs);
          console.log('[ATTEMPT] computed timeLeftSec=', secs);
        } else {
          // no meaningful timer available — do not auto-submit
          setTimeLeftSec(null);
          console.log('[ATTEMPT] no timer (duration missing/0 or startedAt missing). Not auto-submitting on load.');
        }

        loadedRef.current = true;
      } catch (err) {
        console.error('[ATTEMPT] load failed', err);
        Modal.error({ title: 'Unable to load attempt', content: String(err), onOk: () => router.replace('/student/tests') });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, [attemptId, router]);

  // ---------- small SignalR join (defensive) ----------
  useEffect(() => {
    if (!attempt || Number.isNaN(attemptId)) return;

    const API_HUB = (process.env.NEXT_PUBLIC_Hub_BASE ?? '').replace(/\/$/, '') || undefined;
    const hubUrl = API_HUB ? `${API_HUB}/hubs/attempt` : '/hubs/attempt';
    console.log('[ATTEMPT] connecting to hub', hubUrl);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => localStorage.getItem('token') || '' })
      .withAutomaticReconnect()
      .build();

    hubRef.current = connection;

    connection.start()
      .then(async () => {
        const studentId = Number(localStorage.getItem('studentId') || attempt.studentId || 0);
        try {
          const resp = await connection.invoke('JoinAttempt', attemptId, studentId);
          console.log('[ATTEMPT] JoinAttempt resp', resp);
          if (resp === false || (resp && typeof resp === 'object' && resp.ok === false)) {
            Modal.error({ title: 'Cannot join', content: 'Another active session exists for this attempt.', onOk: () => router.replace('/student/tests') });
            return;
          }
          heartbeatRef.current = window.setInterval(() => {
            connection.invoke('Heartbeat', attemptId).catch(() => {});
          }, 10000);
        } catch (e) {
          console.warn('[ATTEMPT] JoinAttempt failed', e);
        }
      })
      .catch(e => {
        console.warn('[ATTEMPT] SignalR start failed', e);
      });

    connection.on('ForceDisconnect', (msg: string) => {
      message.warning(msg || 'Disconnected by server');
      cleanup();
      router.replace('/student/tests');
    });

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const cleanup = () => {
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null; }
    if (autosaveRef.current) { clearInterval(autosaveRef.current); autosaveRef.current = null; }
    if (hubRef.current) {
      try { hubRef.current.invoke('LeaveAttempt', attemptId).catch(()=>{}); } catch {}
      hubRef.current.stop().catch(()=>{});
      hubRef.current = null;
    }
  };

  // ---------- Timer tick ----------
  useEffect(() => {
    // if there's no numeric timer or attempt hasn't started — skip
    if (timeLeftSec === null) {
      console.debug('[ATTEMPT][TIMER] no timer set; skipping.');
      return;
    }

    // Only run auto-submit logic if the paper actually had a positive duration
    if (durationRef.current <= 0) {
      console.debug('[ATTEMPT][TIMER] duration is zero; skipping auto-submit.');
      return;
    }

    // if attempt not started, skip auto-submit
    if (!hasStartedRef.current) {
      console.debug('[ATTEMPT][TIMER] attempt not started; skipping auto-submit.');
      return;
    }

    if (didSubmitRef.current) return;

    if (timeLeftSec <= 0) {
      if (attempt && String(attempt.status || '').toLowerCase().includes('inprogress')) {
        void handleAutoSubmit();
      }
      return;
    }

    const t = setInterval(() => {
      setTimeLeftSec(prev => {
        if (!prev) return 0;
        if (prev <= 1) {
          clearInterval(t);
          if (!didSubmitRef.current && hasStartedRef.current && attempt && String(attempt.status || '').toLowerCase().includes('inprogress')) {
            void handleAutoSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeftSec, attempt]);

  // ---------- autosave every 5s ----------
  useEffect(() => {
    autosaveRef.current = window.setInterval(() => {
      for (const qIdStr of Object.keys(answers)) {
        const qId = Number(qIdStr);
        const a = answers[qId];
        saveAnswer({ attemptId, questionId: qId, selectedOptionId: a.selectedOptionId ?? null, markForReview: !!a.marked })
          .catch(e => console.warn('[ATTEMPT] autosave failed', e));
      }
    }, 5000);

    return () => {
      if (autosaveRef.current) { clearInterval(autosaveRef.current); autosaveRef.current = null; }
    };
  }, [answers, attemptId]);

  // ---------- beforeunload / back navigation handlers (auto-submit guard) ----------
  useEffect(() => {
    const beforeUnload = () => {
      try { if (hubRef.current) hubRef.current.invoke('LeaveAttempt', attemptId).catch(()=>{}); } catch {}
      void handleAutoSubmit();
    };
    const onPop = () => {
      void handleAutoSubmit();
    };

    window.addEventListener('beforeunload', beforeUnload);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('beforeunload', beforeUnload);
      window.removeEventListener('popstate', onPop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, answers]);

  // ---------- answer handlers ----------
  const chooseOption = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...(prev[questionId] || {}), selectedOptionId: optionId } }));
    saveAnswer({ attemptId, questionId, selectedOptionId: optionId }).catch(e => console.warn('SaveAnswer failed', e));
  };

  const toggleMark = (questionId: number) => {
    setAnswers(prev => {
      const cur = prev[questionId] || {};
      const next = { ...cur, marked: !cur.marked };
      saveAnswer({ attemptId, questionId, markForReview: next.marked }).catch(e => console.warn('SaveAnswer(mark) failed', e));
      return { ...prev, [questionId]: next };
    });
  };

  // ---------- navigation and locking ----------
  const saveCurrent = async (qId?: number) => {
    if (!qId) return;
    const a = answers[qId];
    setSaving(true);
    try {
      await saveAnswer({ attemptId, questionId: qId, selectedOptionId: a?.selectedOptionId ?? null, markForReview: !!a?.marked });
    } catch (e) {
      console.warn('saveCurrent failed', e);
      message.error('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    const q = questions[currentIndex];
    if (q) await saveCurrent(q.questionId);

    if (!initialMoveDoneRef.current) {
      lockedAfterIndexRef.current = currentIndex;
      initialMoveDoneRef.current = true;
    }

    setCurrentIndex(i => Math.min(questions.length - 1, i + 1));
  };

  const handlePrevious = async () => {
    if (lockedAfterIndexRef.current !== null && currentIndex - 1 <= lockedAfterIndexRef.current) {
      message.warning('You cannot go back to earlier questions after moving forward.');
      return;
    }
    const q = questions[currentIndex];
    if (q) await saveCurrent(q.questionId);
    setCurrentIndex(i => Math.max(0, i - 1));
  };

  // ---------- submit / autosubmit ----------
  const handleSubmit = () => {
    Modal.confirm({
      title: 'Submit Attempt',
      content: 'Submit attempt now? You will not be able to continue.',
      onOk: async () => {
        if (didSubmitRef.current) return;
        didSubmitRef.current = true;

        // stop timers & background work first
        cleanup();
        try {
          const studentId = Number(localStorage.getItem('studentId') || attempt?.studentId || 0);
          console.info('[ATTEMPT][MANUAL] submit payload', { attemptId, studentId });
          await completeAttempt({ attemptId, studentId });

          // After successful completeAttempt, redirect to results page (we fetch results there)
          message.success('Submitted — showing results');
          router.replace(`/student/exams/results/${attemptId}`);
        } catch (e) {
          console.error('CompleteAttempt failed', e);
          didSubmitRef.current = false;
          message.error('Submit failed');
        }
      }
    });
  };

  const handleAutoSubmit = async () => {
    if (didSubmitRef.current) return;
    if (durationRef.current <= 0) {
      console.debug('[ATTEMPT][AUTO] skipping auto-submit because duration <= 0');
      return;
    }

    didSubmitRef.current = true;
    // stop timers & background work
    cleanup();
    try {
      const studentId = Number(localStorage.getItem('studentId') || attempt?.studentId || 0);
      console.info('[ATTEMPT][AUTO] auto-submitting attempt', { attemptId, studentId });
      await completeAttempt({ attemptId, studentId });
      message.info('Auto-submitted due to time or navigation');

      // navigate to results page
      router.replace(`/student/exams/results/${attemptId}`);
    } catch (e) {
      console.error('Auto-complete failed', e);
      didSubmitRef.current = false;
      message.error('Auto-submit failed');
    }
  };

  // ---------- render helpers ----------
  const fmtTime = (s: number | null) => {
    if (s === null) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <div className="w-full max-w-6xl">
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <div className="w-full max-w-6xl">
          <Card>
            <div className="py-12 text-center text-gray-600">Attempt not found.</div>
          </Card>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex] ?? { title: '', options: [], questionId: undefined };
  const total = questions.length;
  const isMarked = q.questionId ? !!answers[q.questionId]?.marked : false;
  const selectedId = q.questionId ? answers[q.questionId]?.selectedOptionId : undefined;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex gap-8">
            {/* Left: main question area */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Text strong>Time Left:</Text>{' '}
                  <Tag color="blue" style={{ fontSize: 14 }}>{timeLeftSec === null ? '--:--' : fmtTime(timeLeftSec)}</Tag>
                </div>

                <div>
                  <Space>
                    <Button onClick={handlePrevious}>Previous</Button>
                    <Button onClick={handleNext}>Next</Button>
                    <Button onClick={() => { if (q.questionId) toggleMark(q.questionId); }}>{isMarked ? 'Unmark' : 'Mark'}</Button>
                    <Button type="primary" onClick={handleSubmit}>Submit</Button>
                  </Space>
                </div>
              </div>

              <Card variant="outlined" className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Question {Math.min(total, currentIndex + 1)} / {total}</div>
                <Title level={5} style={{ marginBottom: 12 }}>{q.title}</Title>

                <div>
                  {(q.options || []).map((opt: any, idx: number) => (
                    <div key={opt.id ?? idx} className="mb-3">
                      <label style={{ cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name={`q-${q.questionId}`}
                          checked={selectedId === opt.id}
                          onChange={() => q.questionId && chooseOption(q.questionId, opt.id)}
                        />
                        <span style={{ marginLeft: 8 }}>{opt.optionText}</span>
                      </label>
                    </div>
                  ))}
                </div>

                <Divider />

                <div className="text-sm text-gray-600">{saving ? 'Saving...' : 'Saved'}</div>
              </Card>

              {/* Optional question navigation grid */}
              <Card size="small" title="Questions" variant="outlined">
                <div className="grid grid-cols-10 gap-2">
                  {questions.map((qq: any, i: number) => {
                    const answered = !!answers[qq.questionId]?.selectedOptionId;
                    const locked = lockedAfterIndexRef.current !== null && i <= (lockedAfterIndexRef.current ?? -1);
                    const isCurrent = i === currentIndex;
                    return (
                      <button
                        key={qq.questionId ?? i}
                        onClick={() => {
                          // respect lock
                          if (locked) {
                            message.warning('You cannot go back to earlier questions after moving forward.');
                            return;
                          }
                          setCurrentIndex(i);
                        }}
                        className={`rounded-full w-8 h-8 flex items-center justify-center text-sm ${isCurrent ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} ${answered ? 'ring-2 ring-green-400' : ''}`}
                        title={`Q ${i + 1}${answered ? ' • answered' : ''}${locked ? ' • locked' : ''}`}
                      >
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Right: quick info */}
            <div style={{ width: 320 }}>
              <Card size="small" title="Quick Info" variant="outlined">
                <div className="text-sm text-gray-700">
                  
                  <Text strong>Status:</Text>
                  <div className="mb-2">
                    {attempt.status === 'InProgress' && <Tag color="orange">In progress</Tag>}
                    {attempt.status === 'Completed' && <Tag color="green">Completed</Tag>}
                    {(!['InProgress', 'Completed'].includes(attempt.status || '')) && <Tag>{attempt.status}</Tag>}
                  </div>

                  <Divider />

                  <Text strong>Started At:</Text>
                  <div className="mb-2">{attempt.startedAt ? new Date(attempt.startedAt).toLocaleString() : '—'}</div>

                  <Text strong>Duration:</Text>
                  <div className="mb-2">{attempt.durationMinutes ? `${attempt.durationMinutes} minutes` : 'N/A'}</div>

                  <Divider />

                  <Text strong>Saving:</Text>
                  <div className="mb-2">{saving ? 'In progress' : 'Last saved'}</div>

                  <Divider />

                  <Text strong>Support</Text>
                  <Paragraph style={{ fontSize: 13 }}>
                    If something goes wrong, contact <a href="mailto:support@example.com">support@example.com</a> and include attempt id.
                  </Paragraph>
                </div>
              </Card>

              <div style={{ height: 12 }} />

              <Card size="small" title="Hints" variant="outlined">
                <ul className="list-disc pl-5 text-sm text-gray-700">
                  <li>Autosave every 5s and on option change.</li>
                  <li>Questions locked after moving forward once.</li>
                  <li>Time will auto-submit when expired.</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
