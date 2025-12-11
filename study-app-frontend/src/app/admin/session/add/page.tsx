'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addSession } from '@/services/sessionService';
import { Session } from '@/types/session';
import {toast} from "sonner"
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function AddSessionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Session>({
        id: 0,
        title: '',
        description: '',
        sessionYear: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> 
    | string 
    | null,
  name?: string
) => {
  // 👉 When DatePicker returns a string (selected date)
  if (typeof e === "string" && name) {
    setFormData({
      ...formData,
      [name]: e,
    });
    return;
  }

  // 👉 When DatePicker is cleared (null)
  if (e === null && name) {
    setFormData({
      ...formData,
      [name]: "",
    });
    return;
  }

  // 👉 Normal input / textarea / select
  if (typeof e !== "string" && e?.target) {
    const { name: fieldName, value } = e.target;

    setFormData({
      ...formData,
      [fieldName]: value,
    });
  }
};


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const sessionToSend: Session = {
            ...formData,
            sessionYear: new Date(formData.sessionYear).toISOString(),
        };

        try {
            setLoading(true);
            await addSession(sessionToSend);
             toast.success('Session added successfully!');
            router.push('/admin/session/listing');
        } catch (error) {
            console.error('Failed to add session:', error);
             toast.error('Error adding session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    🗓️ Add New Session
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title + Session Year in one row */}
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
                                placeholder="Enter session title"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                        </div>

                        {/* Session Year */}
                         <div>
                        <label className="block mb-1 font-medium text-gray-700">Session Year</label>
                        <DatePicker
                            value={formData.sessionYear? dayjs(formData.sessionYear) : null}
                            onChange={(date) => {
                                if (date) {
                                const iso = date.toDate().toISOString();  
                                handleChange(iso,"sessionYear");
                                } else {
                                handleChange("", "sessionYear");
                                }
                            }}
                            format="DD-MM-YYYY"
                            className="w-full border border-gray-300 rounded-lg px-4 py-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            style={{ height: "40px" }}
                            />

                        </div>
                    </div>

                    {/* Description full width */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Enter session description"
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Buttons aligned to right */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/session/listing')}
                            className="px-6 py-2 rounded-lg font-semibold bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-sm transition-transform transform hover:-translate-y-0.5"
                        >
                            Cancel
                        </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-8 py-2 rounded-lg font-semibold shadow-md transition-transform transform hover:-translate-y-0.5 ${
                                    loading
                                        ? 'bg-blue-400 text-white cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {loading ? 'Submitting...' : 'Add Session'}
                            </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
