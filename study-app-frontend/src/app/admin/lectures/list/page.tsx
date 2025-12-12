'use client';

import { useEffect, useState } from 'react';
import { Table, Input, Select,Button, Modal, Popconfirm } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { getLectures,deleteLecturesbyId  } from '@/services/lecturesServices';
import { LecturesModel } from '@/types/lecturesModel';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default function LecturesPage() {
    const [lectures, setLectures] = useState<LecturesModel[]>([]);
    const [filteredLectures, setFilteredLectures] = useState<LecturesModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(10);

    // For video modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchLectures = async () => {
            try {
                const data = await getLectures();
                setLectures(data);
                setFilteredLectures(data);
            } catch (error) {
                console.error('Error fetching lectures:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLectures();
    }, []);

const convertToEmbedUrl = (url: string) => {
    if (url.includes("youtu.be")) {
        const id = url.split("youtu.be/")[1].split("?")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
        const id = url.split("watch?v=")[1].split("&")[0];
        return `https://www.youtube.com/embed/${id}`;
    }

    return url;
};

const handleDelete = async (id: number) => {
    try {
        await deleteLecturesbyId(id);

        const updated = lectures.filter(l => l.id !== id);
        setLectures(updated);
        setFilteredLectures(updated);

    } catch (error) {
        console.error("Failed to delete lecture:", error);
    }
};


    // 🔍 Search filter
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        const lower = value.toLowerCase();

        const filtered = lectures.filter(
            (l) =>
                l.title.toLowerCase().includes(lower) ||
                l.description.toLowerCase().includes(lower) ||
                l.youtubeUrl.toLowerCase().includes(lower)
        );

        setFilteredLectures(filtered);
    };

    // Table columns
    const columns: ColumnsType<LecturesModel> = [
        {
            title: '#',
            key: 'index',
            render: (_: unknown, __: LecturesModel, index: number) => index + 1,
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            render: (imageUrl: string | undefined) =>
                imageUrl ? (
                    <img
                        src={`${process.env.NEXT_PUBLIC_BASE_URL}${imageUrl}`}
                        alt="lecture"
                        className="w-20 h-20 object-cover rounded-md border"
                    />
                ) : (
                    'No Image'
                ),
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
            render: (text: string) => (
                <span className="line-clamp-2">{text}</span>
            )
        },
    {
    title: 'Lecture Video',
    key: 'youtubeUrl',
    render: (_: unknown, record: LecturesModel) => (
        <button
            onClick={() => {
                const embed = convertToEmbedUrl(record.youtubeUrl);
                setSelectedVideoUrl(embed);
                setIsModalOpen(true);
            }}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
        >
            ▶ Watch
        </button>
    ),
},
 {
            title: 'Action',
            key: 'action',
            render: (_: unknown, record: LecturesModel) => (
                <Popconfirm
                    title="Delete Lectures?"
                    description="This will permanently delete the lectures. Are you sure?"
                    onConfirm={() => handleDelete(Number(record.id))}
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
            <div className="w-full max-w-7xl bg-white rounded-2xl shadow-md p-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">🎓 Lectures</h1>

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
                            placeholder="Search lectures..."
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
                        Loading lectures...
                    </div>
                ) : filteredLectures.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-lg font-medium">
                        No lectures found.
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredLectures}
                        rowKey="id"
                        pagination={{
                            pageSize,
                            showSizeChanger: false,
                            showTotal: (total) => `Total ${total} lectures`,
                        }}
                        bordered
                        className="border border-gray-200 rounded-lg"
                        rowClassName={() => 'hover:bg-gray-50'}
                    />
                )}
            </div>

            {/* Video Modal */}
           <Modal
            title="Lecture Video"
            open={isModalOpen}
            footer={null}
            onCancel={() => {
                setIsModalOpen(false);
                setSelectedVideoUrl(null);
            }}
            width={600} // smaller modal
        >
            {selectedVideoUrl && (
                <iframe
                    width="100%"
                    height="320"    // smaller video height
                    src={selectedVideoUrl}
                    className="rounded-lg"
               
                />
            )}
        </Modal>

        </div>
    );
}
