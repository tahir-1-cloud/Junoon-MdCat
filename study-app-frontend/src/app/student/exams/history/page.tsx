'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Tag, Card, Divider, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Trophy, BookOpenCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  getMyAttempts,
  getAttemptResult,
} from '@/services/attemptService';

interface AttemptRow {
  attemptId: number;
  paperId: number;
  paperTitle: string;
  attemptedOn: string;
  status: string;
  correct: number;
  total: number;
  percentage: number;
}

export default function AttemptHistoryPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [selectedAttemptId, setSelectedAttemptId] = useState<number | null>(null);
  const [result, setResult] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // load attempts table
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getMyAttempts();
        setAttempts(data);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const openResultModal = async (attemptId: number) => {
    setSelectedAttemptId(attemptId);
    setModalOpen(true);
    setModalLoading(true);

    try {
      const data = await getAttemptResult(attemptId);
      setResult(data);
    } finally {
      setModalLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setResult(null);
    setSelectedAttemptId(null);
  };

  const columns: ColumnsType<AttemptRow> = [
    {
      title: 'Paper',
      dataIndex: 'paperTitle',
      render: text => <strong>{text}</strong>,
    },
    {
      title: 'Attempted On',
      dataIndex: 'attemptedOn',
      render: date => new Date(date).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: status =>
        status === 'Completed' ? (
          <Tag color="green">Completed</Tag>
        ) : (
          <Tag color="orange">In Progress</Tag>
        ),
    },
    {
      title: 'Score',
      render: (_, r) => (
        <span>
          {r.correct} / {r.total} ({r.percentage}%)
        </span>
      ),
    },
    {
      title: 'Action',
      render: (_, r) => (
        <Button type="primary" onClick={() => openResultModal(r.attemptId)}>
          View Result
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Exam Attempts</h2>
            <Button onClick={() => router.replace('/student/exams/listing')}>
              Back to Exams
            </Button>
          </div>

          <Table
            columns={columns}
            dataSource={attempts}
            rowKey="attemptId"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        {/* RESULT MODAL */}
        <Modal
          open={modalOpen}
          onCancel={closeModal}
          footer={null}
          width={900}
          destroyOnClose
        >
          {modalLoading ? (
            <div className="py-20 flex justify-center">
              <Spin size="large" />
            </div>
          ) : (
            result && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Trophy size={36} className="text-blue-600" />
                  <div>
                    <h3 className="text-xl font-bold">
                      {result.paperTitle ?? 'Result'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Attempted on{' '}
                      {result.attemptedOn
                        ? new Date(result.attemptedOn).toLocaleString()
                        : '—'}
                    </p>
                  </div>
                </div>

                <Card className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-lg font-semibold">
                        {result.correct} / {result.total}
                      </h4>
                      <p className="text-sm text-gray-600">Correct answers</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {result.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                  </div>
                </Card>

                <Divider />

                <div className="flex items-center gap-2 text-gray-700">
                  <BookOpenCheck />
                  <span className="text-sm">
                    Question-wise result already implemented on full result page.
                  </span>
                </div>

                <Divider />

                <div className="text-right">
                  <Button onClick={closeModal}>Close</Button>
                </div>
              </div>
            )
          )}
        </Modal>
      </div>
    </div>
  );
}
