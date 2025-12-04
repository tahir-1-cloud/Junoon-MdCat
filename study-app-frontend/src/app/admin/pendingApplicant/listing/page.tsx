'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Session } from '@/types/session';
import {getAllMockPapers} from "@/services/mocktestService";
import {CreateMockTestDto} from "@/types/mocktest";

export default function Page() {
    const [papers, setpapers] = useState<CreateMockTestDto[]>([]);
    const [filteredPapers, setFilteredPapers] = useState<CreateMockTestDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getAllMockPapers();
                setpapers(data);
                setFilteredPapers(data);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // 🔍 Search filter handler
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();
        const filtered = papers.filter(
            (s) =>
                s.title.toLowerCase().includes(lower) ||
                new Date(s.testConductedOn).getFullYear().toString().includes(lower)
        );
        setFilteredPapers(filtered);
    };

    const columns: ColumnsType<CreateMockTestDto> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: CreateMockTestDto, index: number) => index + 1,
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
            render: (testConductedOn: string) => new Date(testConductedOn).toLocaleDateString(),
        },
    ];

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
                {loading ? (
                    <div className="flex justify-center py-20 text-gray-600 text-lg font-medium">
                        Loading MockPaper...
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No MockPaper found.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredPapers}
                        rowKey="id"
                        pagination={{
                            pageSize,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} MockPaper`,
                        }}
                        bordered
                        className="border border-gray-200 rounded-lg"
                        style={{
                            borderRadius: '12px',
                        }}
                        rowClassName={() => 'hover:bg-gray-50'}
                        onHeaderRow={() => ({
                            className: 'bg-blue-50 text-gray-700',
                        })}
                    />
                )}
            </div>
        </div>
    );
}
