'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Modal, Tag , Popconfirm, message} from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getAllMockResults, getMockResultDetail,deletemockResult } from '@/services/mocktestService';
import { MockTestResults,MockTestResultDetail } from '@/types/mocktest';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function MockTestResultsPage() {
    const [results, setResults] = useState<MockTestResults[]>([]);
    const [filteredResults, setFilteredResults] = useState<MockTestResults[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    // Modal states
    const [detailModalOpen, setDetailModalOpen] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [detailData, setDetailData] = useState<MockTestResultDetail | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const data = await getAllMockResults();
                setResults(data);
                setFilteredResults(data);
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, []);

    // Load detailed result
    const handleViewDetail = async (id: number) => {
        setDetailLoading(true);
        setDetailModalOpen(true);

        try {
            const data = await getMockResultDetail(id);
            setDetailData(data);
        } catch (error) {
            console.error('Error fetching detail:', error);
        } finally {
            setDetailLoading(false);
        }
    };

    // Search filter
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();

        const filtered = results.filter(
            (r) =>
                r.id.toString().includes(lower) ||
                r.correct.toString().includes(lower) ||
                r.incorrect.toString().includes(lower) ||
                r.total.toString().includes(lower) ||
                r.percentage.toString().includes(lower)
        );

        setFilteredResults(filtered);
    };
    
    // ✅ Delete handler
    const handleDeleteMockResults = async (resultId: number) => {
        try {
            // Call API to delete
            await deletemockResult(resultId);

            // Success message
            message.success('Mock test result deleted successfully.');

            // Remove deleted item from state
            const updatedResults = results.filter(r => r.id !== resultId);
            setResults(updatedResults);

            // Update filtered results based on search
            setFilteredResults(
                updatedResults.filter(r =>
                    r.id.toString().includes(searchTerm.toLowerCase()) ||
                    r.correct.toString().includes(searchTerm.toLowerCase()) ||
                    r.incorrect.toString().includes(searchTerm.toLowerCase()) ||
                    r.total.toString().includes(searchTerm.toLowerCase()) ||
                    r.percentage.toString().includes(searchTerm.toLowerCase())
                )
            );
        } catch (error: any) {
            console.error('Failed to delete mock test result', error);
            const msg = error?.response?.data ?? error?.message ?? 'Failed to delete mock test result';
            message.error(typeof msg === 'string' ? msg : 'Failed to delete mock test result');
        }
    };


    const columns: ColumnsType<MockTestResults> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: MockTestResults, index: number) => index + 1,
        },
        {
            title: 'Correct',
            dataIndex: 'correct',
            key: 'correct',
        },
        {
            title: 'Incorrect',
            dataIndex: 'incorrect',
            key: 'incorrect',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Percentage',
            dataIndex: 'percentage',
            key: 'percentage',
            render: (p: number) => `${p}%`,
        },
        {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <div className="flex gap-2">
                <Button type="primary" onClick={() => handleViewDetail(record.id)}>
                    View Details
                </Button>

                <Popconfirm
                    title="Are you sure to delete this result?"
                    onConfirm={() => handleDeleteMockResults(record.id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" danger>
                        Delete
                    </Button>
                </Popconfirm>
            </div>
        ),
    },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">📊 Mock Test Results</h1>

                    <div className="flex items-center gap-3">
                        <span className="text-gray-500 text-sm">Show</span>

                        <Select
                            value={pageSize}
                            onChange={(value) => setPageSize(value)}
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
                <Table
                    columns={columns}
                    dataSource={filteredResults}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize,
                        showSizeChanger: false,
                        showTotal: (total) => `Total ${total} results`,
                    }}
                    bordered
                    className="border border-gray-200 rounded-lg"
                />

                {/* Modal */}
                <Modal
                title={null}
                open={detailModalOpen}
                onCancel={() => setDetailModalOpen(false)}
                footer={null}
                width={750}
                className="custom-modal"
                
                >
                {/* Header */}
                <div className="bg-white-600 text-black p-4 rounded-t-lg mb-4">
                    <h2 className="text-xl font-bold">Mock Test Result Details</h2>
                </div>

                {detailLoading || !detailData ? (
                    <p className="p-4">Loading details...</p>
                ) : (
                    <div className="p-4 bg-white">

                        {/* Summary */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                            <div className="p-3 bg-blue-50 border rounded">
                                <p className="font-bold text-blue-700">Correct</p>
                                <p className="text-black">{detailData.correct}</p>
                            </div>
                            <div className="p-3 bg-blue-50 border rounded">
                                <p className="font-bold text-blue-700">Incorrect</p>
                                <p className="text-black">{detailData.incorrect}</p>
                            </div>
                            <div className="p-3 bg-blue-50 border rounded">
                                <p className="font-bold text-blue-700">Total Questions</p>
                                <p className="text-black">{detailData.total}</p>
                            </div>
                            <div className="p-3 bg-blue-50 border rounded">
                                <p className="font-bold text-blue-700">Percentage</p>
                                <p className="text-black">{detailData.percentage}%</p>
                            </div>
                            <div className="p-3 bg-blue-50 border rounded col-span-2 sm:col-span-1">
                                <p className="font-bold text-blue-700">Attempt Date</p>
                                <p className="text-black">{new Date(detailData.attemptDate).toLocaleString()}</p>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold mb-4">Question Breakdown</h3>

                        {detailData.details.map((item, index) => (
                            <div key={index} className="mb-4 p-4 border rounded-lg bg-gray-50">
                                <p className="font-medium text-black">
                                    {index + 1}. {item.questionText}
                                </p>

                                {/* Student Answer */}
                                <p className="mt-2 text-black">
                                    <strong>Student Answer:</strong> {item.selectedOption}{' '}
                                    {item.isCorrect ? (
                                        <Tag color="green">Correct</Tag>
                                    ) : (
                                        <Tag color="red">Wrong</Tag>
                                    )}
                                </p>

                                {/* Always show correct answer */}
                                <p className="text-black">
                                    <strong>Correct Answer:</strong> {item.correctOption}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                </Modal>

            </div>
        </div>
    );
}
