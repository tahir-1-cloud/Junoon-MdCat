'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { Student } from '@/types/student';
import { getAllStudents } from "@/services/userService";

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const data = await getAllStudents();
                setStudents(data);
                setFilteredStudents(data);
            } catch (error) {
                console.error('Error fetching students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // 🔍 Handle search filtering
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();
        const filtered = students.filter((student) =>
            student.fullName.toLowerCase().includes(lower) ||
            student.fatherName.toLowerCase().includes(lower) ||
            student.cnic.toLowerCase().includes(lower) ||
            student.phoneNumber.toLowerCase().includes(lower) ||
            student.emailAddress.toLowerCase().includes(lower)
        );
        setFilteredStudents(filtered);
    };

    const columns: ColumnsType<Student> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_: unknown, __: Student, index: number) => index + 1,
        },
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Father Name', dataIndex: 'fatherName', key: 'fatherName' },
        { title: 'CNIC', dataIndex: 'cnic', key: 'cnic' },
        { title: 'Phone', dataIndex: 'phoneNumber', key: 'phoneNumber' },
        { title: 'Email', dataIndex: 'emailAddress', key: 'emailAddress' },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: string) => new Date(dob).toLocaleDateString(),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">🎓 Student List</h1>
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
                        Loading...
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No students found.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredStudents}
                        rowKey="id"
                        pagination={{
                            pageSize,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} students`,
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
