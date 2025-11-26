'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Session } from '@/types/session';
import {getAllPapers} from "@/services/paperService";
import {PaperModel} from "@/types/createPaper.model";
import {router} from "next/client";
import Link from "next/link";

export default function Page() {
    const [papers, setpapers] = useState<PaperModel[]>([]);
    const [filteredPapers, setFilteredPapers] = useState<PaperModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getAllPapers();
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

    const columns: ColumnsType<PaperModel> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: PaperModel, index: number) => index + 1,
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
        {
            title: 'Action',
            key: 'action',
            render: (_: unknown, paper: PaperModel) => (
                <Link
                    href={`/admin/paper/${paper.id}/add-question`}
                    className="px-3 py-1 rounded font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow transition"
                >
                    Add Question
                </Link>
            ),
        }
    ];

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
                        Loading sessions...
                    </div>
                ) : filteredPapers.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No sessions found.
                    </div>
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
