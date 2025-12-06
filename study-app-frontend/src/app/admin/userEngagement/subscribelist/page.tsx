'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getAllSubscriber } from '@/services/publicServices';
import { subscriber } from '@/types/contactus';

export default function SubscriberListPage() {
    const [subscribers, setSubscribers] = useState<subscriber[]>([]);
    const [filteredSubscribers, setFilteredSubscribers] = useState<subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const data = await getAllSubscriber();
                setSubscribers(data);
                setFilteredSubscribers(data);
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    // 🔍 Search filter handler
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();

        const filtered = subscribers.filter(
            (s) => s.email.toLowerCase().includes(lower)
        );

        setFilteredSubscribers(filtered);
    };

    const columns: ColumnsType<subscriber> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: subscriber, index: number) => index + 1,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: Date) =>
                date ? new Date(date).toLocaleDateString() : '—',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        📧 Subscriber List
                    </h1>

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
                            placeholder="Search by email..."
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
                        Loading subscribers...
                    </div>
                ) : filteredSubscribers.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No subscribers found.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredSubscribers}
                        rowKey="id"
                        pagination={{
                            pageSize,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} subscribers`,
                        }}
                        bordered
                        className="border border-gray-200 rounded-lg"
                        style={{ borderRadius: '12px' }}
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
