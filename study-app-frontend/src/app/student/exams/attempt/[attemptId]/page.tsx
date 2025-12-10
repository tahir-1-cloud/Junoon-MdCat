// src/app/student/attempt/[attemptId]/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { Button, Modal, message, Space } from 'antd';

export default function AttemptRunner({ params }: { params: { attemptId: string }}) {
  const attemptId = Number(params.attemptId);
  const router = useRouter();

  const [attempt, setAttempt] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { selectedOptionId?: number, marked?: boolean }>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number | null>(null);

  const hubRef = useRef<signalR.HubConnection | null>(null);
  const heartbeatRef = useRef<number | null>(null);
  const autosaveRef = useRef<number | null>(null);

  // -------------------------
  // Load attempt (with debug logging + axios + fetch fallback)
  // -------------------------
  useEffect(() => {
    const load = async () => {
      console.log('[ATTEMPT] loading attempt', attemptId);

      // Try axios first (this matches your existing usage)
      try {
        const res = await axios.get(`/api/Attempt/GetAttempt/${attemptId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        console.log('[ATTEMPT][axios] status', res.status, 'data', res.data);

        if (!res || !res.data) throw new Error('Empty axios response');

        setAttempt(res.data);
        setQuestions(res.data.questions || []);
        const startedAt = res.data.startedAt ? new Date(res.data.startedAt) : new Date(res.data.attemptedOn);
        const end = new Date(startedAt.getTime() + (res.data.durationMinutes ?? 0) * 60000);
        setTimeLeftSec(Math.max(0, Math.floor((end.getTime() - Date.now()) / 1000)));
        return;
      } catch (axiosErr) {
        console.warn('[ATTEMPT] axios GET failed or returned empty - falling back to fetch. error:', axiosErr);
      }

      // Fallback: raw fetch (guarantees a network entry so you can inspect)
      try {
        const fetchUrl = `/api/Attempt/GetAttempt/${attemptId}`;
        console.log('[ATTEMPT][fetch] request to', fetchUrl);

        const fetchResp = await fetch(fetchUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        console.log('[ATTEMPT][fetch] status', fetchResp.status);

        const raw = await fetchResp.text();
        console.log('[ATTEMPT][fetch] raw body', raw);

        if (!fetchResp.ok) {
          const reason = raw || `HTTP ${fetchResp.status}`;
          console.error('[ATTEMPT] fetch failed:', reason);
          Modal.error({
            title: 'Unable to load attempt',
            content: `Server returned ${fetchResp.status}: ${reason}`,
          });
          return;
        }

        const json = raw ? JSON.parse(raw) : null;
        console.log('[ATTEMPT][fetch] json', json);

        if (!json) {
          Modal.error({ title: 'Empty attempt', content: 'No attempt data returned from server.' });
          return;
        }

        setAttempt(json);
        setQuestions(json.questions || []);
        const startedAt2 = json.startedAt ? new Date(json.startedAt) : new Date(json.attemptedOn);
        const end2 = new Date(startedAt2.getTime() + (json.durationMinutes ?? 0) * 60000);
        setTimeLeftSec(Math.max(0, Math.floor((end2.getTime() - Date.now()) / 1000)));
        return;
      } catch (fetchErr) {
        console.error('[ATTEMPT] fetch error', fetchErr);
        Modal.error({
          title: 'Failed to load attempt',
          content: String(fetchErr),
        });
        // keep user on page for debugging — don't redirect automatically
        return;
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // -------------------------
  // SignalR setup (join/heartbeat/force disconnect)
  // -------------------------
  useEffect(() => {
    if (!attempt) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/attempt', { accessTokenFactory: () => localStorage.getItem('token') || '' })
      .withAutomaticReconnect()
      .build();

    hubRef.current = connection;

    connection.start()
      .then(async () => {
        const studentId = Number(localStorage.getItem('studentId') || '0');
        console.log('[ATTEMPT][SignalR] started, invoking JoinAttempt', attemptId, studentId);

        try {
          const ok = await connection.invoke('JoinAttempt', attemptId, studentId);
          console.log('[ATTEMPT][SignalR] JoinAttempt result', ok);
          if (!ok) {
            Modal.error({ title: 'Cannot join', content: 'Another active session exists for this attempt.' });
            router.push('/student/tests');
            return;
          }

          heartbeatRef.current = window.setInterval(() => {
            connection.invoke('Heartbeat', attemptId).catch((e) => console.warn('Heartbeat error', e));
          }, 10000);
        } catch (e) {
          console.error('[ATTEMPT][SignalR] JoinAttempt invoke failed', e);
          Modal.error({ title: 'SignalR error', content: String(e) });
          router.push('/student/tests');
        }
      })
      .catch((err: unknown) => {
        console.error('SignalR start error', err);
        // non-fatal: show a message but let user continue in read-only if needed
        message.error('Realtime connection failed. Attempt will continue but multi-tab enforcement may be disabled.');
      });

    connection.on('ForceDisconnect', (msg: string) => {
      message.warning(msg || 'Disconnected by server');
      cleanup();
      router.push('/student/tests');
    });

    return () => cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  // -------------------------
  // Cleanup helper
  // -------------------------
  const cleanup = () => {
    if (heartbeatRef.current) { clearInterval(heartbeatRef.current); heartbeatRef.current = null; }
    if (autosaveRef.current) { clearInterval(autosaveRef.current); autosaveRef.current = null; }
    if (hubRef.current) {
      hubRef.current.invoke('LeaveAttempt', attemptId).catch(()=>{});
      hubRef.current.stop().catch(()=>{});
      hubRef.current = null;
    }
  };

  // -------------------------
  // Timer tick
  // -------------------------
  useEffect(() => {
    if (timeLeftSec === null) return;
    if (timeLeftSec <= 0) {
      handleAutoSubmit();
      return;
    }
    const t = setInterval(() => {
      setTimeLeftSec(prev => {
        if (!prev) return 0;
        if (prev <= 1) {
          clearInterval(t);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeftSec]);

  // -------------------------
  // Autosave every 5s
  // -------------------------
  useEffect(() => {
    autosaveRef.current = window.setInterval(() => {
      try {
        for (const qIdStr of Object.keys(answers)) {
          const qId = Number(qIdStr);
          const a = answers[qId];
          axios.post('/api/Attempt/SaveAnswer', {
            attemptId,
            questionId: qId,
            selectedOptionId: a.selectedOptionId,
            markForReview: a.marked
          }).catch((e) => console.warn('Autosave answer failed', e));
        }
      } catch (e) {
        console.warn('Autosave loop error', e);
      }
    }, 5000);

    return () => {
      if (autosaveRef.current) { clearInterval(autosaveRef.current); autosaveRef.current = null; }
    };
  }, [answers, attemptId]);

  // -------------------------
  // beforeunload beacon + leave
  // -------------------------
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        if (hubRef.current) hubRef.current.invoke('LeaveAttempt', attemptId).catch(()=>{});
        // optionally: navigator.sendBeacon to save a tiny payload to server
      } catch (e) {
        console.warn('beforeunload error', e);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attemptId]);

  // -------------------------
  // Answer handlers
  // -------------------------
  const chooseOption = (questionId: number, optionId: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...(prev[questionId] || {}), selectedOptionId: optionId } }));
    axios.post('/api/Attempt/SaveAnswer', { attemptId, questionId, selectedOptionId: optionId })
      .catch(e => console.warn('SaveAnswer failed', e));
  };

  const toggleMark = (questionId: number) => {
    setAnswers(prev => {
      const cur = prev[questionId] || {};
      const next = { ...cur, marked: !cur.marked };
      axios.post('/api/Attempt/SaveAnswer', { attemptId, questionId, markForReview: next.marked })
        .catch(e => console.warn('SaveAnswer(mark) failed', e));
      return { ...prev, [questionId]: next };
    });
  };

  // -------------------------
  // Submit / auto-submit
  // -------------------------
  const handleSubmit = () => {
    Modal.confirm({
      title: 'Submit Attempt',
      content: 'Submit attempt now? You will not be able to continue.',
      onOk: async () => {
        try {
          await axios.post('/api/Attempt/CompleteAttempt', { attemptId });
          message.success('Submitted');
          cleanup();
          router.push('/student/tests');
        } catch (e) {
          console.error('CompleteAttempt failed', e);
          message.error('Submit failed');
        }
      }
    });
  };

  const handleAutoSubmit = async () => {
    try {
      await axios.post('/api/Attempt/CompleteAttempt', { attemptId });
      message.info('Auto-submitted due to time up');
      cleanup();
      router.push('/student/tests');
    } catch (e) {
      console.error('Auto-complete failed', e);
      message.error('Auto-submit failed');
    }
  };

  // -------------------------
  // Render
  // -------------------------
  if (!attempt) {
    return (
      <div style={{ padding: 20 }}>
        <h3>Loading attempt...</h3>
        <p>Check console & network panel for debugging info (request to <code>/api/Attempt/GetAttempt/{attemptId}</code>).</p>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div style={{ padding: 20 }}>
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <div>
          Time Left:&nbsp;
          <strong>
            {Math.floor((timeLeftSec || 0) / 60)}:{String((timeLeftSec || 0) % 60).padStart(2,'0')}
          </strong>
        </div>

        <div>
          <Button onClick={() => setCurrentIndex(i => Math.max(0,i-1))}>Previous</Button>
          <Button onClick={() => setCurrentIndex(i => Math.min(questions.length-1,i+1))}>Next</Button>
          <Button onClick={() => toggleMark(q.questionId)}>Mark</Button>
          <Button type="primary" onClick={handleSubmit}>Submit</Button>
        </div>
      </Space>

      <div style={{ marginTop: 20 }}>
        <h3>{q.title}</h3>
        <div>
          {q.options?.map((opt: any) => (
            <div key={opt.id} style={{ margin: '8px 0' }}>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="radio"
                  name={`q-${q.questionId}`}
                  checked={answers[q.questionId]?.selectedOptionId === opt.id}
                  onChange={() => chooseOption(q.questionId, opt.id)}
                />
                {' '}{opt.optionText}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
