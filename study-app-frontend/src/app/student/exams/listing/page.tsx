// src/app/student/tests/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Spin, message, Modal } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAssignedPapersForStudent,
  startAttempt as startAttemptService,
  getAttemptsForStudent,
} from '@/services/studentService';
import type { AssignedPaperDto, StudentAttemptDto} from '@/types/student';
import type { StartAttemptResponse} from '@/services/studentService';
import { ExclamationCircleOutlined } from '@ant-design/icons';

function getStudentId(): number {
  return Number(process.env.NEXT_PUBLIC_TEST_STUDENT_ID ?? 1);
}

export default function StudentAssignedTestsPage() {
  const [assigned, setAssigned] = useState<AssignedPaperDto[]>([]);
  const [attempts, setAttempts] = useState<StudentAttemptDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [starting, setStarting] = useState<number | null>(null);

  const studentId = getStudentId();
  const router = useRouter();

  useEffect(() => {
    loadAssigned();
    loadAttempts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAssigned = async () => {
    setLoading(true);
    try {
      const data = await getAssignedPapersForStudent(studentId);
      setAssigned(data);
    } catch (err) {
      console.error(err);
      message.error('Failed to load assigned tests');
    } finally {
      setLoading(false);
    }
  };

  const loadAttempts = async () => {
    setAttemptsLoading(true);
    try {
      const data = await getAttemptsForStudent(studentId);
      setAttempts(data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setAttemptsLoading(false);
    }
  };

  const getAttemptForPaper = (paperId: number) =>
    attempts.find((a) => Number(a.paperId) === Number(paperId)) ?? null;

  async function handleStart(paperId: number) {
    const now = new Date();
    const assignedRow = assigned.find((p) => p.id === paperId);
    if (assignedRow) {
      if (assignedRow.availableFrom && new Date(assignedRow.availableFrom) > now) {
        message.warning('This test is not open yet.');
        return;
      }
      if (assignedRow.availableTo && new Date(assignedRow.availableTo) < now) {
        message.warning('This test window has ended.');
        return;
      }
    }

    Modal.confirm({
      title: 'Start Test?',
      icon: <ExclamationCircleOutlined />,
      content: 'Timer will begin immediately. Are you sure you want to start?',
      okText: 'Start',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setStarting(paperId);
          //const resp = await startAttemptService({ paperId, studentId }) as StartAttemptResponse;
          const resp = await startAttemptService({ paperId, studentId });
          if (!resp || !resp.attemptId) {
            // use server message if available, otherwise fallback text
            message.error(resp?.message ?? 'Failed to start attempt');
            return;
          }

          message.success('Test started!');
          router.push(`/student/exams/attempt/${resp.attemptId}`);
        } catch (err: unknown) {
          console.error(err);
          if (err instanceof Error) {
            message.error(err.message ?? 'Could not start attempt');
          } else {
            message.error('Could not start attempt');
          }
        } finally {
          setStarting(null);
        }
      },
    });
  }

  function handleResume(attemptId: number) {
    router.push(`/student/exams/attempt/${attemptId}`);
  }

  const columns: ColumnsType<AssignedPaperDto> = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_: any, __: AssignedPaperDto, idx: number) => idx + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (t, r) => (
        <div>
          <div className="font-medium text-gray-800">{t}</div>
          <div className="text-xs text-gray-500">{r.sessionTitle}</div>
        </div>
      ),
    },
    {
      title: 'Test Date',
      dataIndex: 'testConductedOn',
      key: 'testConductedOn',
      render: (d) => (d ? new Date(d).toLocaleString() : '--'),
    },
    {
      title: 'Window',
      key: 'window',
      render: (_, r) => {
        if (!r.availableFrom && !r.availableTo) return 'Always available';
        return (
          <div className="text-sm text-gray-600">
            {r.availableFrom ? new Date(r.availableFrom).toLocaleString() : '--'} →{' '}
            {r.availableTo ? new Date(r.availableTo).toLocaleString() : '--'}
          </div>
        );
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, r) => {
        const att = getAttemptForPaper(r.id);
        if (!att) return <Tag color="default">Not started</Tag>;
        if (att.status === 'InProgress') return <Tag color="processing">In Progress</Tag>;
        if (att.status === 'Completed') return <Tag color="success">Completed</Tag>;
        return <Tag>{att.status}</Tag>;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, r) => {
        const att = getAttemptForPaper(r.id);

        const now = new Date();
        const startsLater = r.availableFrom ? new Date(r.availableFrom) > now : false;
        const ended = r.availableTo ? new Date(r.availableTo) < now : false;
        const disabled = Boolean(startsLater || ended);

        return (
          <Space size="small">
            {!att && (
              <Button
                type="primary"
                disabled={disabled}
                loading={starting === r.id}
                onClick={() => handleStart(r.id)}
              >
                Start
              </Button>
            )}

            {att?.status === 'InProgress' && (
              <Button type="primary" loading={starting === r.id} onClick={() => handleResume(att.id)}>
                Resume
              </Button>
            )}

            {att?.status === 'Completed' && (
              <Link href={`/student/result/${att.id}`}>
                <Button>Result</Button>
              </Link>
            )}

            <Link href={`/student/exams/${r.id}/ViewDetails`}>
              <Button>Details</Button>
            </Link>
          </Space>
        );
      },
    },
  ];

  const isBusy = loading || attemptsLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">📘 Assigned Tests</h1>
        </div>

        {isBusy ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={assigned}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="border border-gray-200 rounded-lg"
            locale={{
              emptyText: (
                <div className="py-12 text-gray-500">
                  No assigned tests.
                </div>
              ),
            }}
          />
        )}
      </div>
    </div>
  );
}
