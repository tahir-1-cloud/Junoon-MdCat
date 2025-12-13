'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Tag,
  Spin,
  Card,
  Divider,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { EyeOutlined } from '@ant-design/icons';
import {
  getAllStudentAttempts,
  getAttemptResultByAdmin,
  AdminAttemptListDto,
  AttemptResultDto
} from '@/services/paperService';

export default function AdminResultsPage() {
  const [data, setData] = useState<AdminAttemptListDto[]>([]);
  const [filtered, setFiltered] = useState<AdminAttemptListDto[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sessionFilter, setSessionFilter] = useState<number | undefined>();
  const [paperFilter, setPaperFilter] = useState<number | undefined>();

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState<AttemptResultDto | null>(null);

  /* ===================== LOAD ===================== */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const rows = await getAllStudentAttempts();
        setData(rows);
        setFiltered(rows);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ===================== FILTER ===================== */

  useEffect(() => {
    let rows = [...data];

    if (search.trim()) {
      const s = search.toLowerCase();
      rows = rows.filter(r =>
        r.studentName.toLowerCase().includes(s) ||
        r.paperTitle.toLowerCase().includes(s) ||
        (r.sessionTitle ?? '').toLowerCase().includes(s)
      );
    }

    if (sessionFilter !== undefined) {
      rows = rows.filter(r => r.sessionId === sessionFilter);
    }

    if (paperFilter !== undefined) {
      rows = rows.filter(r => r.paperId === paperFilter);
    }

    setFiltered(rows);
  }, [search, sessionFilter, paperFilter, data]);

  /* ===================== ACTION ===================== */

  const handleViewResult = async (attemptId: number) => {
    setDetailOpen(true);
    setDetailLoading(true);
    try {
      const res = await getAttemptResultByAdmin(attemptId);
      setDetailData(res);
    } finally {
      setDetailLoading(false);
    }
  };

  /* ===================== TABLE ===================== */

  const columns: ColumnsType<AdminAttemptListDto> = [
    { title: '#', render: (_, __, i) => i + 1, width: 60 },
    { title: 'Student', dataIndex: 'studentName' },
    { title: 'Paper', dataIndex: 'paperTitle' },
    {
      title: 'Session',
      dataIndex: 'sessionTitle',
      render: v => v ?? '—',
    },
    {
      title: 'Score',
      render: (_, r) => r.score.toFixed(2),
    },
    {
      title: 'Percentage',
      dataIndex: 'percentage',
      render: p => <Tag color={p >= 50 ? 'green' : 'red'}>{p}%</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: s =>
        s === 'Completed'
          ? <Tag color="green">Completed</Tag>
          : <Tag color="orange">{s}</Tag>,
    },
    {
      title: 'Action',
      render: (_, r) => (
        <Button icon={<EyeOutlined />} onClick={() => handleViewResult(r.attemptId)}>
          View Result
        </Button>
      ),
    },
  ];

  /* ===================== SELECT OPTIONS ===================== */

  const sessionOptions = Array.from(
    new Map(
      data
        .filter(d => d.sessionId != null)
        .map(d => [
          d.sessionId!,
          { value: d.sessionId!, label: d.sessionTitle ?? '—' },
        ])
    ).values()
  );

  const paperOptions = Array.from(
    new Map(
      data.map(d => [
        d.paperId,
        { value: d.paperId, label: d.paperTitle },
      ])
    ).values()
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold">📊 Student Exam Results</h1>

          <div className="flex gap-3 flex-wrap">
            <Input.Search
              placeholder="Search student / paper / session"
              allowClear
              onChange={e => setSearch(e.target.value)}
              className="w-64"
            />

            <Select
              placeholder="Session"
              allowClear
              className="w-44"
              options={sessionOptions}
              onChange={v => setSessionFilter(v)}
            />

            <Select
              placeholder="Paper"
              allowClear
              className="w-44"
              options={paperOptions}
              onChange={v => setPaperFilter(v)}
            />
          </div>
        </div>

        {/* Table */}
        <Table
          rowKey="attemptId"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 10 }}
          bordered
        />

        {/* ===================== RESULT MODAL ===================== */}
        <Modal
          open={detailOpen}
          onCancel={() => setDetailOpen(false)}
          footer={null}
          width={900}
          title="Student Result Details"
        >
          {detailLoading || !detailData ? (
            <Spin />
          ) : (
            <>
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <strong>Correct</strong>
                  <div className="text-xl">{detailData.correct}</div>
                </Card>
                <Card>
                  <strong>Total</strong>
                  <div className="text-xl">{detailData.total}</div>
                </Card>
                <Card>
                  <strong>Percentage</strong>
                  <div className="text-xl">{detailData.percentage}%</div>
                </Card>
                <Card>
                  <strong>Status</strong>
                  <div>
                    <Tag color="green">{detailData.status}</Tag>
                  </div>
                </Card>
              </div>

              <Divider />

              {/* Question Breakdown */}
              <h3 className="text-lg font-semibold mb-4">
                Question Breakdown
              </h3>

              {detailData.questions.map((q, i) => (
                <div
                  key={q.questionId}
                  className="mb-4 p-4 border rounded-lg bg-gray-50"
                >
                  <p className="font-medium">
                    {i + 1}. {q.questionText}
                  </p>

                  <p className="mt-2">
                    <strong>Student Answer:</strong>{' '}
                    {q.userSelectedOptionText ?? 'Not Answered'}{' '}
                    {q.isCorrect ? (
                      <Tag color="green">Correct</Tag>
                    ) : (
                      <Tag color="red">Wrong</Tag>
                    )}
                  </p>

                  <p>
                    <strong>Correct Answer:</strong>{' '}
                    {q.correctOptionText}
                  </p>
                </div>
              ))}
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}
