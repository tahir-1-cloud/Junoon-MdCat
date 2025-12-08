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
import { getAllPapers, deletePaper, assignPaperToSession } from '@/services/paperService';
import { QuestionService } from '@/services/QuestionService';
import { getAllSessions } from '@/services/sessionService';
import axiosInstance from '@/services/axiosInstance';
import type { PaperModel } from '@/types/createPaper.model';
import type { Question } from '@/services/QuestionService';
import type { Session } from '@/types/session';
import { ExclamationCircleOutlined, TeamOutlined, AppstoreAddOutlined } from '@ant-design/icons';

export default function Page() {
  const [papers, setPapers] = useState<PaperModel[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<PaperModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(10);

  // Questions modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalPaper, setModalPaper] = useState<PaperModel | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qLoading, setQLoading] = useState(false);
  const [qError, setQError] = useState<string | null>(null);

  // Assign modal
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [assignPaper, setAssignPaper] = useState<PaperModel | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [assignedSessionIds, setAssignedSessionIds] = useState<number[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);

  // expanded rows for question options
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getAllPapers();
        setPapers(data);
        setFilteredPapers(data);
      } catch (err) {
        console.error('Failed to load papers', err);
        message.error('Failed to load papers');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const refreshPapers = async () => {
    setLoading(true);
    try {
      const data = await getAllPapers();
      setPapers(data);
      if (searchTerm && searchTerm.trim() !== '') {
        handleSearch(searchTerm);
      } else {
        setFilteredPapers(data);
      }
    } catch (err) {
      console.error('Failed to refresh papers', err);
      message.error('Failed to refresh papers');
    } finally {
      setLoading(false);
    }
  };

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

  // open questions modal
  const openQuestionsModal = async (paper: PaperModel) => {
    setModalPaper(paper);
    setModalVisible(true);
    setQuestions([]);
    setQError(null);
    setQLoading(true);
    setExpandedRowKeys([]);

    try {
      const qs = await QuestionService.getQuestionsForPaper(Number(paper.id));

      const normalized = (qs ?? []).map((q: any) => ({
        ...q,
        id: parseQuestionId(q),
        options: Array.isArray(q.options)
          ? q.options.map((opt: any) => ({ ...opt, isCorrect: parseIsCorrect(opt.isCorrect) }))
          : [],
      }));

      setQuestions(normalized);
    } catch (err: any) {
      console.error('Failed loading questions', err);
      const msg = err?.response?.data ?? err?.message ?? 'Failed to load questions';
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

  // toggle show options for a question
  const toggleShowOptions = (question: Question) => {
    const key = parseQuestionId(question) ?? JSON.stringify(question);
    setExpandedRowKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  // delete question
  const handleDeleteQuestion = async (questionId: number | undefined) => {
    if (questionId === undefined) {
      message.error('Question id not available');
      return;
    }

    try {
      await QuestionService.deleteQuestion(questionId);
      message.success('Question deleted');
      if (modalPaper) {
        // refresh modal list
        const qs = await QuestionService.getQuestionsForPaper(Number(modalPaper.id));
        const normalized = (qs ?? []).map((q: any) => ({
          ...q,
          id: parseQuestionId(q),
          options: Array.isArray(q.options)
            ? q.options.map((opt: any) => ({ ...opt, isCorrect: parseIsCorrect(opt.isCorrect) }))
            : [],
        }));
        setQuestions(normalized);
        setExpandedRowKeys((prev) => prev.filter((k) => k !== questionId));
      }
    } catch (err: any) {
      console.error('Delete failed', err, err?.response);
      const msg = err?.response?.data ?? err?.message ?? 'Failed to delete';
      message.error(typeof msg === 'string' ? msg : 'Failed to delete question');
    }
  };

  // delete paper (and related data) - backend must cascade
  const handleDeletePaper = async (paperId: number | undefined) => {
    if (paperId === undefined) {
      message.error('Paper id not available');
      return;
    }

    try {
      await deletePaper(paperId);
      message.success('Paper deleted successfully (and related data).');
      await refreshPapers();
    } catch (err: any) {
      console.error('Failed deleting paper', err);
      const msg = err?.response?.data ?? err?.message ?? 'Failed to delete paper';
      message.error(typeof msg === 'string' ? msg : 'Failed to delete paper');
    }
  };

  // ---------- Assign modal: show all sessions, but render "Assigned" disabled for already-assigned ----------
  const openAssignModal = async (paper: PaperModel) => {
    setAssignPaper(paper);
    setAssignModalVisible(true);
    setSessions([]);
    setAssignedSessionIds([]);
    setSessionsError(null);
    setSelectedSessionId(null);
    setSessionsLoading(true);

    try {
      // 1) load all sessions (show them all so admin can see assigned items)
      const all = await getAllSessions();
      setSessions(all);

      // 2) load paper details to get assigned session ids
      const resp = await axiosInstance.get(`/Paper/GetPaperWithQuestion?paperId=${paper.id}`);
      const assignedIds = resp?.data?.paperSessions?.map((ps: any) => Number(ps.sessionId)) ?? [];
      setAssignedSessionIds(Array.from(new Set(assignedIds)));
    } catch (err: any) {
      console.error('Failed to load sessions or paper assignments', err);
      setSessionsError('Failed to load sessions');
    } finally {
      setSessionsLoading(false);
    }
  };

  const closeAssignModal = () => {
    setAssignModalVisible(false);
    setAssignPaper(null);
    setSessions([]);
    setAssignedSessionIds([]);
    setSessionsError(null);
    setSelectedSessionId(null);
    setAssignLoading(false);
  };

  const handleAssign = async () => {
    if (!assignPaper || selectedSessionId == null) {
      message.warning('Please select a session to assign.');
      return;
    }

    setAssignLoading(true);
    try {
      await assignPaperToSession(Number(assignPaper.id), Number(selectedSessionId));
      message.success('Paper assigned to session successfully.');
      closeAssignModal();
      await refreshPapers();
    } catch (err: any) {
      console.error('Failed to assign paper', err);
      const msg = err?.response?.data ?? err?.message ?? 'Failed to assign';
      message.error(typeof msg === 'string' ? msg : 'Failed to assign paper');
    } finally {
      setAssignLoading(false);
    }
  };

  // Table columns for papers
  const columns: ColumnsType<PaperModel> = [
    {
      title: '#',
      key: 'index',
      render: (_: unknown, __: PaperModel, idx: number) => idx + 1,
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
      render: (_: unknown, paper: PaperModel) => (
        <Space size="small">
          <Link href={`/admin/paper/${paper.id}/add-question`} className="no-underline">
            <Button
              type="default"
              size="small"
              shape="round"
              icon={<AppstoreAddOutlined />}
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
            onClick={() => openQuestionsModal(paper)}
            style={{
              background: '#f8fafc',
              border: '1px solid #e6e9ef',
              color: '#333',
              padding: '4px 12px',
            }}
          >
            Show Questions
          </Button>

          <Button
            size="small"
            onClick={() => openAssignModal(paper)}
            icon={<TeamOutlined />}
            style={{
              padding: '4px 12px',
              borderRadius: 20,
            }}
            type="default"
          >
            Assign
          </Button>

          <Popconfirm
            title="Delete paper?"
            description="This will permanently delete the paper and all related data (questions, attempts, results). Are you sure?"
            onConfirm={() => handleDeletePaper(Number(paper.id))}
            okText="Delete"
            cancelText="Cancel"
            icon={<ExclamationCircleOutlined />}
            getPopupContainer={() => document.body}
          >
            <Button danger type="primary" size="small" style={{ padding: '4px 10px', borderRadius: 20 }}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Question table columns
  const questionColumns: ColumnsType<Question> = [
    {
      title: '#',
      key: 'idx',
      render: (_: any, __: Question, idx: number) => idx + 1,
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
      dataIndex: 'options',
      key: 'options',
      render: (opts: any[]) => <div>{Array.isArray(opts) ? opts.length : 0}</div>,
      width: 120,
    },
    {
      title: 'Action',
      key: 'action',
      width: 160,
      render: (_: any, q: Question) => {
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

  // Render expanded row (options)
  const expandedRowRender = (q: Question) => {
    if (!q || !Array.isArray(q.options)) return null;
    return (
      <div className="bg-gray-50 p-4 rounded-md">
        {q.options.map((opt, i) => (
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
          <h1 className="text-3xl font-bold text-gray-800">📘 Papers</h1>
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
            rowKey={(r) => String((r as any).id)}
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

        {/* Assign to Batch Modal */}
        <Modal
          title={assignPaper ? `Assign — ${assignPaper.title}` : 'Assign to batch'}
          open={assignModalVisible}
          onCancel={closeAssignModal}
          footer={[
            <Button key="cancel" onClick={closeAssignModal} size="small">
              Cancel
            </Button>,
            <Button key="assign" type="primary" loading={assignLoading} onClick={handleAssign} size="small">
              Assign
            </Button>,
          ]}
          width={800}
          centered
        >
          {sessionsLoading ? (
            <div className="w-full flex justify-center py-8">
              <Spin />
            </div>
          ) : sessionsError ? (
            <Alert message="Error" description={sessionsError} type="error" showIcon />
          ) : sessions.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No sessions available. Create sessions first.
            </div>
          ) : (
            <div>
              <div className="mb-4 text-sm text-gray-600">Select a session to assign this paper to:</div>
              <Table
                dataSource={sessions}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: '#',
                    key: 'idx',
                    render: (_: any, __: Session, idx: number) => idx + 1,
                    width: 60,
                  },
                  {
                    title: 'Title',
                    dataIndex: 'title',
                    key: 'title',
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (d: string) => <div className="text-sm text-gray-600">{d}</div>,
                  },
                  {
                    title: 'Session Year',
                    dataIndex: 'sessionYear',
                    key: 'sessionYear',
                    render: (y: string) => new Date(y).getFullYear(),
                    width: 120,
                  },
                  {
                    title: 'Action',
                    key: 'action',
                    width: 260,
                    render: (_: any, r: Session) => {
                      const isAssigned = assignedSessionIds.includes(Number(r.id));
                      const isSelected = selectedSessionId === Number(r.id);

                      return (
                        <Space size="small">
                          {isAssigned ? (
                            <>
                              <Button
                                size="small"
                                disabled
                                style={{ background: '#f3f4f6', color: '#6b7280', borderColor: '#e5e7eb' }}
                              >
                                Assigned
                              </Button>

                              <Popconfirm
                                title="Unassign this paper from the session?"
                                description="This will remove the paper from the session."
                                onConfirm={async () => {
                                  if (!assignPaper) {
                                    message.error('Paper not available');
                                    return;
                                  }
                                  setAssignLoading(true);
                                  try {
                                    // call unassign endpoint
                                    await axiosInstance.post('/Paper/UnassignFromSession', {
                                      paperId: Number(assignPaper.id),
                                      sessionId: Number(r.id),
                                    });

                                    message.success('Paper unassigned successfully.');

                                    // refresh assigned ids for this paper
                                    const resp = await axiosInstance.get(
                                      `/Paper/GetPaperWithQuestion?paperId=${assignPaper.id}`
                                    );
                                    const updatedAssigned =
                                      resp?.data?.paperSessions?.map((ps: any) => Number(ps.sessionId)) ?? [];
                                    setAssignedSessionIds(Array.from(new Set(updatedAssigned)));
                                  } catch (err: any) {
                                    console.error('Failed to unassign', err);
                                    const msg = err?.response?.data ?? err?.message ?? 'Failed to unassign';
                                    message.error(typeof msg === 'string' ? msg : 'Failed to unassign');
                                  } finally {
                                    setAssignLoading(false);
                                  }
                                }}
                                okText="Unassign"
                                cancelText="Cancel"
                                getPopupContainer={() => document.body}
                              >
                                <Button size="small" danger loading={assignLoading}>
                                  Unassign
                                </Button>
                              </Popconfirm>
                            </>
                          ) : (
                            <>
                              <Button
                                size="small"
                                type={isSelected ? 'primary' : 'default'}
                                onClick={() => setSelectedSessionId(Number(r.id))}
                                style={{ minWidth: 90 }}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </Button>

                              <Button
                                size="small"
                                onClick={async () => {
                                  setSelectedSessionId(Number(r.id));
                                  setAssignLoading(true);
                                  try {
                                    if (!assignPaper) {
                                      message.error('Paper not available');
                                      return;
                                    }
                                    await assignPaperToSession(Number(assignPaper.id), Number(r.id));
                                    message.success('Paper assigned to session successfully.');
                                    closeAssignModal();
                                    await refreshPapers();
                                  } catch (err: any) {
                                    console.error('Failed to assign paper', err);
                                    const msg = err?.response?.data ?? err?.message ?? 'Failed to assign';
                                    message.error(typeof msg === 'string' ? msg : 'Failed to assign paper');
                                  } finally {
                                    setAssignLoading(false);
                                  }
                                }}
                              >
                                Assign now
                              </Button>
                            </>
                          )}
                        </Space>
                      );
                    },
                  },
                ]}
              />
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
