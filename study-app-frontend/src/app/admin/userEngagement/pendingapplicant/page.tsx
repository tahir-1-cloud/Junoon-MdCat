'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Popconfirm, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { studentEnrollmentlist } from '@/types/studentEnrollment';
import { getAllEnrollStudent, deleteEnrollStudent } from '@/services/enrollmentService';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function Page() {
    const [students, setStudents] = useState<studentEnrollmentlist[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<studentEnrollmentlist[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    const fetchData = async () => {
        try {
            const data = await getAllEnrollStudent();
            setStudents(data);
            setFilteredStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // 🔍 Search filter
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();

        const filtered = students.filter(
            (s) =>
                s.fullName.toLowerCase().includes(lower) ||
                s.email.toLowerCase().includes(lower) ||
                s.phoneNumber.toLowerCase().includes(lower) ||
                s.preferredCourse.toLowerCase().includes(lower) ||
                (s.city ? s.city.toLowerCase().includes(lower) : false) ||
                s.status.toLowerCase().includes(lower)
        );

        setFilteredStudents(filtered);
    };

    // ✅ Delete handler
    const handleDeleteStudent = async (studentId: number) => {
        try {
            await deleteEnrollStudent(studentId);
            message.success('Student deleted successfully.');
            const updated = students.filter(s => s.id !== studentId);
            setStudents(updated);
            setFilteredStudents(updated.filter(s =>
                s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.preferredCourse.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (s.city ? s.city.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
                s.status.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        } catch (error: any) {
            console.error('Failed deleting student', error);
            const msg = error?.response?.data ?? error?.message ?? 'Failed to delete student';
            message.error(typeof msg === 'string' ? msg : 'Failed to delete student');
        }
    };

    // 📌 Table Columns
    const columns: ColumnsType<studentEnrollmentlist> = [
        {
            title: '#',
            dataIndex: 'index',
            key: 'index',
            render: (_, __, index) => index + 1,
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
            title: 'Phone Number',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Course',
            dataIndex: 'preferredCourse',
            key: 'preferredCourse',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
            render: (city) => city || '—',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span
                    className={`px-3 py-1 rounded-full text-white ${
                        status === 'Pending'
                            ? 'bg-yellow-500'
                            : status === 'Approved'
                            ? 'bg-green-600'
                            : 'bg-red-600'
                    }`}
                >
                    {status}
                </span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm
                    title="Delete student?"
                    description="This will permanently delete the enrolled student. Are you sure?"
                    onConfirm={() => handleDeleteStudent(Number(record.id))}
                    okText="Delete"
                    cancelText="Cancel"
                    icon={<ExclamationCircleOutlined />}
                    getPopupContainer={() => document.body}
                >
                    <Button
                        danger
                        type="primary"
                        size="small"
                        style={{ padding: '4px 10px', borderRadius: 20 }}
                    >
                        Delete
                    </Button>
                </Popconfirm>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md p-8">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        🎓 Enrolled Students
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
                        Loading students...
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
                        rowClassName={() => 'hover:bg-gray-50'}
                    />
                )}
            </div>
        </div>
    );
}
