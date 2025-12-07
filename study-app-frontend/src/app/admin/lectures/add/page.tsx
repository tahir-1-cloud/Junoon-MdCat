'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Addpubliclectures } from '@/services/lecturesServices';
import {toast} from "sonner"

export default function AddLecturePage() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        youtubeUrl: '',
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Handle Text Inputs
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle Image File
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    };

    // Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fd = new FormData();
        fd.append('title', formData.title);
        fd.append('description', formData.description);
        fd.append('youtubeUrl', formData.youtubeUrl);

        if (imageFile) {
            fd.append('image', imageFile); // MUST MATCH API PARAM NAME
        }

        try {
            setLoading(true);
            await Addpubliclectures(fd);

            toast.success('Lecture added successfully!');
            router.push('/admin/lectures/list');
        } catch (error) {
            console.error('Failed to add lecture:', error);
            toast.error('Error adding lecture.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    🎥 Add New Lecture
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Title + YouTube URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Title */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter lecture title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* YouTube URL */}
                        <div>
                            <label className="block mb-2 font-medium text-gray-700">
                                YouTube URL
                            </label>
                            <input
                                type="text"
                                name="youtubeUrl"
                                value={formData.youtubeUrl}
                                onChange={handleChange}
                                required
                                placeholder="Enter YouTube link"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>

                    {/* Description */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter lecture description"
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Upload Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                       

                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-2 rounded-lg font-semibold shadow-md ${
                                loading
                                    ? 'bg-blue-400 text-white cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        >
                            {loading ? 'Submitting...' : 'Add Lecture'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
