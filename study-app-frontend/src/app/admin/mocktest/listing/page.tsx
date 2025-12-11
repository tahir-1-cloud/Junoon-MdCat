// src/app/admin/paper/listing/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Table,
  Input,
  Select,
  Button,
  Modal,
  Space,
  Spin,
  Alert,
  Popconfirm,
  Tag,
  message,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Session } from '@/types/session';
import {getAllMockPapers} from "@/services/mocktestService";
import { mockQuestionService } from '@/services/mockQuestionService';
import type { MockModel } from '@/types/mocktest';
import type { MockQuestion } from '@/services/mockQuestionService';

export default function Page() {
  const [papers, setPapers] = useState<MockModel[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<MockModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);

  // modal state for showing questions
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPaper, setModalPaper] = useState<MockModel | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState<string | null>(null);

  // track expanded rows (question ids) so we can toggle expand on Show button
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllMockPapers();
        setPapers(data);
        setFilteredPapers(data);
      } catch (err) {
        console.error('Failed to load papers', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

    // 🔍 Search filter handler
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const lower = value.toLowerCase();
    const filtered = papers.filter(
      (p) =>
        p.title?.toLowerCase().includes(lower) ||
        new Date(p.testConductedOn).getFullYear().toString().includes(lower)
    );
    setFilteredPapers(filtered);
  };

  // tolerant helpers (normalize API shapes)
  function parseQuestionId(q: any): number | undefined {
    if (!q) return undefined;
    if (typeof q.id === 'number') return q.id;
    if (typeof q.id === 'string' && q.id.trim() !== '') {
      const n = Number(q.id);
      return Number.isNaN(n) ? undefined : n;
    }
    return undefined;
  }

  function parseIsCorrect(value: any): boolean {
    if (value === true) return true;
    if (value === false) return false;
    if (typeof value === 'string') {
      const s = value.trim().toLowerCase();
      return s === 'true' || s === '1' || s === 'yes';
    }
    if (typeof value === 'number') return value === 1;
    return false;
  }

  const openQuestionsModal = async (mockpaper: MockModel) => {
    setModalPaper(mockpaper);
    setModalVisible(true);
    setQuestions([]);
    setQError(null);
    setQLoading(true);
    setExpandedRowKeys([]);

    try {
      const qs = await mockQuestionService.getQuestionsForPaper(Number(mockpaper.id));

      // Normalize: convert question id -> number when possible, and option.isCorrect -> boolean
      const normalized = (qs ?? []).map((q: any) => ({
        ...q,
        id: parseQuestionId(q),
        options: Array.isArray(q.options)
          ? q.options.map((opt: any) => ({
              ...opt,
              isCorrect: parseIsCorrect(opt.isCorrect),
            }))
          : [],
      }));

      setQuestions(normalized);
    } catch (err: any) {
      console.error('Failed loading questions', err);
      const msg = err?.response?.data ?? err?.message ?? String(err);
      setQError(typeof msg === 'string' ? msg : 'Failed to load questions');
    } finally {
      setQLoading(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalPaper(null);
    setQuestions([]);
    setQError(null);
    setQLoading(false);
    setExpandedRowKeys([]);
  };

  // Toggle expanded state for a question (show/hide options)
  const toggleShowOptions = (question: MockQuestion) => {
    const key = parseQuestionId(question) ?? JSON.stringify(question);
    setExpandedRowKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  // Delete question by id (with confirmation)
    const handleDeleteQuestion = async (mockquestionId: number | undefined) => {
      if (mockquestionId === undefined) {
        message.error('Question id not available');
        return;
      }

      try {
        // Call API to delete the question
        await mockQuestionService.deleteMockQuestion(mockquestionId);
        message.success('Question deleted');

        // Update the local state by filtering out the deleted question
        const updatedQuestions = questions.filter(
          (q) => (parseQuestionId(q) ?? 0) !== mockquestionId
        );
        setQuestions(updatedQuestions);

        // Remove from expanded rows if it was expanded
        setExpandedRowKeys((prev) => prev.filter((k) => k !== mockquestionId));
      } catch (err: any) {
        console.error('Delete failed', err, err?.response);
        const msg = err?.response?.data ?? err?.message ?? 'Failed to delete';
        message.error(typeof msg === 'string' ? msg : 'Failed to delete question');
      }
    };


  const columns: ColumnsType<MockModel> = [
    {
      title: '#',
            dataIndex: 'index',
      key: 'index',
      render: (_: unknown, __: MockModel, idx: number) => idx + 1,
      width: 70,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Test Date',
      dataIndex: 'testConductedOn',
      key: 'testConductedOn',
      render: (d: string) => new Date(d).toLocaleDateString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: unknown, mock: MockModel) => (
        <Space size="small">
          <Link href={`/admin/mocktest/${mock.id}/add-mockquestion`} className="no-underline">
            <Button
              type="default"
              size="small"
              shape="round"
              style={{
                background: 'white',
                border: '1px solid #e6f0ff',
                color: '#2563eb',
                padding: '4px 12px',
                fontWeight: 600,
              }}
            >
              Add Question
            </Button>
          </Link>

          <Button
            size="small"
            shape="round"
            onClick={() => openQuestionsModal(mock)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e6e9ef',
              color: '#333',
              padding: '4px 12px',
            }}
          >
            Show Questions
          </Button>
        </Space>
      ),
    },
  ];

  const questionColumns: ColumnsType<MockQuestion> = [
    {
      title: '#',
      key: 'idx',
      render: (_: any, __: MockQuestion, idx: number) => idx + 1,
      width: 60,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (t: string) => <div className="font-medium">{t}</div>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (d: string) => <div className="text-sm text-gray-600">{d}</div>,
    },
    {
      title: 'Options',
      dataIndex: 'mockOptions',
      key: 'mockOptions',
      render: (opts: any[]) => <div>{Array.isArray(opts) ? opts.length : 0}</div>,
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_: any, q: MockQuestion) => {
        const key = parseQuestionId(q) ?? JSON.stringify(q);
        const isExpanded = expandedRowKeys.includes(key);
        return (
          <Space size="small">
            <Button
              size="small"
              onClick={() => toggleShowOptions(q)}
              style={{
                padding: '4px 10px',
                border: '1px solid #e6e9ef',
                background: isExpanded ? '#eef6ff' : 'white',
              }}
            >
              {isExpanded ? 'Hide' : 'Show'}
            </Button>

            <Popconfirm
              title="Delete question?"
              description="This will permanently delete the question."
              onConfirm={() => {
                const resolvedId = parseQuestionId(q);
                handleDeleteQuestion(resolvedId);
              }}
              okText="Delete"
              cancelText="Cancel"
              getPopupContainer={() => document.body}
            >
              <Button danger size="small" style={{ padding: '4px 10px' }}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  // Render expanded row: show the options for the question with correct marked
  const expandedRowRender = (q: MockQuestion) => {
    if (!q || !Array.isArray(q.mockOptions)) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        {q.mockOptions.map((opt, i) => (
          <div
            key={opt.id ?? i}
            className="flex items-center justify-between gap-4 p-3 rounded-md mb-2"
            style={{
              background: opt.isCorrect ? '#ecfdf5' : '#ffffff',
              border: opt.isCorrect ? '1px solid #34d399' : '1px solid #eef2f7',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-6 text-sm font-semibold text-gray-700">{String.fromCharCode(65 + i)}.</div>
              <div className="text-gray-800">{opt.optionText}</div>
            </div>
            {opt.isCorrect && <Tag color="success">Correct</Tag>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">📘Mock Papers</h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm">Show</span>
            <Select
              value={pageSize}
              onChange={(v) => setPageSize(Number(v))}
              options={[
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 20, label: '20' },
                { value: 50, label: '50' },
              ]}
              className="w-20"
            />
            <Input.Search
              placeholder="Search..."
              allowClear
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-64"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-600 text-lg font-medium">Loading papers...</div>
        ) : filteredPapers.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-lg font-medium">No papers found.</div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredPapers}
            rowKey="id"
            pagination={{
              pageSize,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} sessions`,
            }}
            bordered
            className="border border-gray-200 rounded-lg"
            style={{ borderRadius: '12px' }}
            rowClassName={() => 'hover:bg-gray-50'}
            onHeaderRow={() => ({ className: 'bg-blue-50 text-gray-700' })}
          />
        )}

        {/* Questions Modal */}
        <Modal
          title={modalPaper ? `Questions — ${modalPaper.title}` : 'Questions'}
          open={modalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal} size="small">
              Close
            </Button>,
          ]}
          width={900}
          centered
        >
          {qLoading ? (
            <div className="w-full flex justify-center py-8">
              <Spin />
            </div>
          ) : qError ? (
            <Alert message="Error" description={qError} type="error" showIcon />
          ) : questions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <div style={{ fontSize: 14, marginBottom: 6 }}>No questions added for this paper.</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>Use the Add Question page from the main list to create questions.</div>
            </div>
          ) : (
            <Table
              columns={questionColumns}
              dataSource={questions}
              rowKey={(r) => parseQuestionId(r) ?? JSON.stringify(r)}
              pagination={{ pageSize: 8, showSizeChanger: false }}
              size="small"
              expandable={{
                expandedRowKeys,
                onExpandedRowsChange: (keys) => setExpandedRowKeys(Array.from(keys)),
                expandedRowRender,
                expandRowByClick: false,
              }}
            />
          )}
        </Modal>
      </div>
    </div>
  );
}
