'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getAllContactInfo } from '@/services/publicServices';
import { contactus } from '@/types/contactus';

export default function ContactListPage() {
    const [contacts, setContacts] = useState<contactus[]>([]);
    const [filteredContacts, setFilteredContacts] = useState<contactus[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const data = await getAllContactInfo();
                setContacts(data);
                setFilteredContacts(data);
            } catch (error) {
                console.error('Error fetching contact list:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    // 🔍 Search filter handler
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();

        const filtered = contacts.filter(
            (c) =>
                c.fullName.toLowerCase().includes(lower) ||
                c.email.toLowerCase().includes(lower) ||
                c.message.toLowerCase().includes(lower)
        );

        setFilteredContacts(filtered);
    };

    const columns: ColumnsType<contactus> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: contactus, index: number) => index + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Message',
            dataIndex: 'message',
            key: 'message',
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
                        📩 Contact Messages
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
                        Loading contacts...
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No contacts found.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredContacts}
                        rowKey="id"
                        pagination={{
                            pageSize,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} contacts`,
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
