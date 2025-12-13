'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, Spin, message, Modal,Typography,Divider } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getAssignedPapersForStudent,
  startAttempt as startAttemptService,
  getAttemptsForStudent,
} from '@/services/studentService';
import type { AssignedPaperDto, StudentAttemptDto } from '@/types/student';
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { Title, Text, Paragraph } = Typography;

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
    attempts.find(a => Number(a.paperId) === Number(paperId)) ?? null;

  async function handleStart(paperId: number) {
    const assignedRow = assigned.find(p => p.id === paperId);

    // 🛡️ SAFETY CHECK using isAttempted (authoritative)
    if (assignedRow?.isAttempted) {
      message.info('You have already completed this test.');
      return;
    }

    const now = new Date();
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
      content: (
        <div>
          <Paragraph strong>Please read the rules carefully.</Paragraph>
          <ul style={{ paddingLeft: 18 }}>
            <li>Only <strong>one attempt</strong> is allowed.</li>
            <li>Once submitted, you cannot re-attempt.</li>
            <li>Do not refresh or open multiple tabs.</li>
          </ul>
          <Divider />
        </div>
      ),
      okText: 'Start',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          setStarting(paperId);

          const resp = await startAttemptService({ paperId, studentId });

          if (!resp?.attemptId) {
            message.error('Failed to start attempt');
            return;
          }

          message.success('Test started!');
          router.push(`/student/exams/attempt/${resp.attemptId}`);
        } catch (err: any) {
          console.error(err);
          const serverMsg =
            err?.response?.data ||
            err?.message ||
            'Could not start attempt';
          message.warning(String(serverMsg));
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
      width: 60,
      render: (_: any, __: AssignedPaperDto, idx: number) => idx + 1,
    },
    {
      title: 'Title',
      dataIndex: 'title',
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
      render: d => (d ? new Date(d).toLocaleString() : '--'),
    },
    {
      title: 'Window',
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
      render: (_, r) => {
        if (r.isAttempted) return <Tag color="success">Completed</Tag>;

        const att = getAttemptForPaper(r.id);
        if (att?.status === 'InProgress') return <Tag color="processing">In Progress</Tag>;

        return <Tag>Not started</Tag>;
      },
    },
    {
      title: 'Action',
      render: (_, r) => {
        const att = getAttemptForPaper(r.id);

        const now = new Date();
        const startsLater = r.availableFrom ? new Date(r.availableFrom) > now : false;
        const ended = r.availableTo ? new Date(r.availableTo) < now : false;

        const startDisabled =
          r.isAttempted || startsLater || ended;

        return (
          <Space size="small">
            {!r.isAttempted && !att && (
              <Button
                type="primary"
                disabled={startDisabled}
                loading={starting === r.id}
                onClick={() => handleStart(r.id)}
              >
                Start
              </Button>
            )}

            {att?.status === 'InProgress' && (
              <Button type="primary" onClick={() => handleResume(att.id)}>
                Resume
              </Button>
            )}

            {r.isAttempted && att && (
              <Link href={`/student/exams/results/${att.id}`}>
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">📘 Assigned Tests</h1>

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
          />
        )}
      </div>
    </div>
  );
}
