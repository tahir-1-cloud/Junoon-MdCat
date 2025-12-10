// src/app/student/exams/[Id]/ViewDetails/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Row, Col, Spin, Button, Tag, Modal, message, Divider, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getStudentPaper, StudentPaperDto } from '@/services/paperService';
import {
  getAttemptForPaper,
  startAttempt,
  heartbeat as heartbeatApi,
} from '@/services/studentService';
import type { StudentAttemptDto } from '@/types/student';

const { Title, Text, Paragraph } = Typography;

// TEMP: Replace with actual student auth
function getStudentId(): number {
  return Number(process.env.NEXT_PUBLIC_TEST_STUDENT_ID ?? 1);
}

export default function ViewDetailsPage({ params }: { params: { Id: string } }) {
  const paperId = Number(params.Id);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [paper, setPaper] = useState<StudentPaperDto | null>(null);
  const [attempt, setAttempt] = useState<StudentAttemptDto | null>(null);
  const [startLoading, setStartLoading] = useState(false);

  const studentId = getStudentId();
  const hbRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const p = await getStudentPaper(paperId);
        setPaper(p);

        try {
          const a = await getAttemptForPaper(paperId, studentId);
          setAttempt(a);
        } catch (err: any) {
          // treat 404 as not started
          if (err?.response?.status !== 404) console.error(err);
          setAttempt(null);
        }
      } catch (err: any) {
        console.error(err);
        message.error(err?.message || 'Failed to load paper');
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (hbRef.current) window.clearInterval(hbRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paperId, studentId]);

  // beforeunload: warn & try to send beacon
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (attempt && attempt.status === 'InProgress') {
        e.preventDefault();
        e.returnValue = '';
        try {
          const payload = JSON.stringify({ attemptId: attempt.id, studentId });
          navigator.sendBeacon('/api/Student/LeaveAttempt', payload);
        } catch {}
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [attempt, studentId]);

  function isWithinWindow(): boolean {
    if (!paper) return false;
    if (!paper.availableFrom && !paper.availableTo) return true;
    const now = new Date();
    if (paper.availableFrom && new Date(paper.availableFrom) > now) return false;
    if (paper.availableTo && new Date(paper.availableTo) < now) return false;
    return true;
  }

  function statusTag() {
    if (!attempt) return <Tag>Not started</Tag>;
    if (attempt.status === 'InProgress') return <Tag color="orange">In progress</Tag>;
    if (attempt.status === 'Completed') return <Tag color="green">Completed</Tag>;
    return <Tag>{attempt.status}</Tag>;
  }

  function startHeartbeatLoop(attemptId: number) {
    if (hbRef.current) window.clearInterval(hbRef.current);
    hbRef.current = window.setInterval(() => {
      heartbeatApi({ attemptId, studentId }).catch(() => {
        /* ignore transient failures */
      });
    }, 10000) as unknown as number;
  }

  async function handleStart() {
    if (!paper) return;
    if (!isWithinWindow()) {
      message.warning('This test is not currently available.');
      return;
    }

    Modal.confirm({
      title: 'Start Test?',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <Paragraph strong>Please read the rules before starting.</Paragraph>
          <ul style={{ paddingLeft: 18 }}>
            <li>Only <strong>1 attempt</strong> allowed for this paper.</li>
            <li>Do not open multiple tabs or browsers — single active session enforced.</li>
            <li>Closing the tab keeps the attempt InProgress; you may resume later if allowed.</li>
            <li>Autosave runs in the background; submit to finalize.</li>
          </ul>
          <Divider />
          <Text>Questions: {paper.questions?.length ?? 0} • Duration: {paper.durationMinutes ? `${paper.durationMinutes} min` : 'N/A'}</Text>
        </div>
      ),
      okText: 'Start Test',
      cancelText: 'Cancel',
      onOk: async () => {
        setStartLoading(true);
        try {
          const res = await startAttempt({ paperId, studentId });
          // start heartbeat locally and navigate
          startHeartbeatLoop(res.attemptId);
          router.push(`/student/exams/attempt/${res.attemptId}`);
        } catch (err: any) {
          const status = err?.response?.status;
          const data = err?.response?.data;
          if (status === 400 && typeof data === 'string' && data.toLowerCase().includes('completed')) {
            message.error(data);
            // optionally navigate to result if you can fetch attempt
          } else if (err?.response?.data && err.response.data.attemptId) {
            // concurrent case where server returned existing attempt id in body
            router.push(`/student/exams/attempt/${err.response.data.attemptId}`);
          } else {
            console.error(err);
            message.error(err?.message || 'Could not start attempt');
          }
        } finally {
          setStartLoading(false);
        }
      },
    });
  }

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        </div>
      </div>
    );

  if (!paper)
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
        <div className="w-full max-w-5xl">
          <Card>
            <div className="py-12 text-center text-gray-600">Paper not found.</div>
          </Card>
        </div>
      </div>
    );

  // compute remaining time string if needed
  function getRemainingTime(): string | null {
    if (!attempt || !paper?.durationMinutes || !attempt.startedAt) return null;
    const started = new Date(attempt.startedAt);
    const end = new Date(started.getTime() + paper.durationMinutes * 60000);
    const now = new Date();
    const diffMs = end.getTime() - now.getTime();
    if (diffMs <= 0) return '00:00';
    const mins = Math.floor(diffMs / 60000);
    const secs = Math.floor((diffMs % 60000) / 1000);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <Title level={4} style={{ marginBottom: 6 }}>
                {paper.title}
              </Title>
              <div className="text-sm text-gray-600 mb-4">
                <div>
                  <Text strong>Session:</Text> {paper.sessionTitle ?? '—'}
                </div>
                <div>
                  <Text strong>Test Date:</Text> {paper.testConductedOn ? new Date(paper.testConductedOn).toLocaleString() : 'TBD'}
                </div>
                <div>
                  <Text strong>Questions:</Text> {paper.questions?.length ?? 0}
                </div>
                <div>
                  <Text strong>Duration:</Text> {paper.durationMinutes ? `${paper.durationMinutes} minutes` : 'N/A'}
                </div>
                <div className="mt-2">
                  <Text strong>Status:</Text> {statusTag()}
                </div>
                {attempt?.status === 'InProgress' && paper.durationMinutes && (
                  <div className="mt-2">
                    <Text strong>Time left:</Text> <Tag color="blue">{getRemainingTime()}</Tag>
                  </div>
                )}
              </div>

              <Divider />

              <Title level={5}>Test Instructions</Title>
              <Paragraph style={{ fontSize: 14 }}>
                Read instructions carefully before starting. Use a stable connection. If you lose connectivity your attempt remains InProgress and you can resume later (subject to window).
              </Paragraph>
              <ul className="list-disc pl-6 text-sm text-gray-700">
                <li>Complete the test in one sitting if possible.</li>
                <li>Do not open multiple tabs or browsers — only one active session is allowed.</li>
                <li>Autosave runs in background but always click Submit to finalize your attempt.</li>
                <li>Once Completed you cannot re-attempt this paper.</li>
              </ul>

              <Divider />

              <Title level={5}>Allowed Attempts</Title>
              <Paragraph>1 attempt per student for this paper. Backend enforces this using a unique index and transactional StartAttempt.</Paragraph>

              <div className="mt-6">
                {!attempt && (
                  <Button type="primary" size="large" loading={startLoading} onClick={handleStart} disabled={!isWithinWindow()}>
                    Start Test
                  </Button>
                )}

                {attempt?.status === 'InProgress' && (
                  <>
                    <Button type="default" size="large" onClick={() => router.push(`/student/exams/attempt/${attempt.id}`)}>
                      Resume Test
                    </Button>
                    <Button className="ml-3" onClick={() => message.info('Resume the active attempt in the same browser/device.')}>
                      More info
                    </Button>
                  </>
                )}

                {attempt?.status === 'Completed' && (
                  <Button type="default" size="large" onClick={() => router.push(`/student/result/${attempt.id}`)}>
                    View Result
                  </Button>
                )}
              </div>
            </div>

            <div style={{ width: 320 }}>
              <Card size="small" title="Quick Info" bordered>
                <div className="text-sm text-gray-700">
                  <Text strong>Rules</Text>
                  <ul className="list-disc pl-5 mt-2">
                    <li>No multiple attempts</li>
                    <li>Single active session enforced</li>
                    <li>Use a stable connection</li>
                  </ul>

                  <Divider />

                  <Text strong>Support</Text>
                  <Paragraph style={{ fontSize: 13 }}>
                    If something goes wrong, contact <a href="mailto:support@example.com">support@example.com</a> and include attempt id (if available).
                  </Paragraph>

                  <Divider />

                  <Text strong>Test window</Text>
                  <div className="mt-2 text-sm">
                    <div>
                      <Text>Available from:</Text> {paper.availableFrom ? new Date(paper.availableFrom).toLocaleString() : 'Always'}
                    </div>
                    <div>
                      <Text>Available to:</Text> {paper.availableTo ? new Date(paper.availableTo).toLocaleString() : 'Always'}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
