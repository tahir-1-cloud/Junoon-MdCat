'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Student } from '@/types/student';
import { Session } from '@/types/session';
import { getActiveSessions } from '@/services/sessionService';
import { addStudent } from '@/services/userService';
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function AddStudentPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [formData, setFormData] = useState<Student>({
        id: 0,
        fullName: '',
        cnic: '',
        phoneNumber: '',
        emailAddress: '',
        address: '',
        dob: '',
        fatherName: '',
        password: '',
        sessionId: 0,
    });

    
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getActiveSessions();
                setSessions(data);
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            }
        };

        fetchSessions();
    }, []);

       const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string | null,
        name?: string) => {
        if (typeof e === "string" && name) {
            // Handle DatePicker single date string
            setFormData({
            ...formData,
            [name]: e,
            });
        } else if (e === null && name) {
            // Handle DatePicker cleared value
            setFormData({
            ...formData,
            [name]: "",
            });
        } else if (typeof e !== "string" && e?.target) {
            // Handle normal input/select event
            const { name: fieldName, value } = e.target;
            setFormData({
            ...formData,
            [fieldName]: fieldName === "sessionId" ? Number(value) : value,
            });
        }
        };




    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            console.log('Submitting:', formData);
            await addStudent(formData);
            alert('🎉 Student added successfully!');
            router.push('/admin/student/listing'); // ✅ Redirect after submit
        } catch (err) {
            console.error(err);
            alert('❌ Failed to add student');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl bg-white p-10 rounded-2xl shadow-lg">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Register New Student
                </h1>
               <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input name="fullName" label="Full Name" value={formData.fullName} onChange={handleChange} />
            <Input name="fatherName" label="Father Name" value={formData.fatherName} onChange={handleChange} />
            <Input name="cnic" label="CNIC" value={formData.cnic} onChange={handleChange} />
            <Input name="phoneNumber" label="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
            <Input name="emailAddress" label="Email" type="email" value={formData.emailAddress} onChange={handleChange} />
            <Input name="address" label="Address" value={formData.address} onChange={handleChange} />

            <div>
                <label className="block mb-1 font-medium text-gray-700">Date of Birth</label>
               <DatePicker
                value={formData.dob ? dayjs(formData.dob) : null}
                onChange={(date) => {
                    if (date) {
                    const iso = date.toDate().toISOString();  
                    handleChange(iso, "dob");
                    } else {
                    handleChange("", "dob");
                    }
                }}
                format="DD-MM-YYYY"
                className="w-full border border-gray-300 rounded-lg px-4 py-[9px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                style={{ height: "40px" }}
                />

            </div>

            <Input name="password" label="Password" type="password" value={formData.password} onChange={handleChange} />

            {/* Session Dropdown */}
            <div className="col-span-1 md:col-span-2">
                <label className="block mb-1 font-medium text-gray-700">Session</label>
                <select
                name="sessionId"
                value={formData.sessionId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                >
                <option value="">-- Select Session --</option>
                {sessions.map((session) => (
                    <option key={session.id} value={session.id}>
                    {session.title}
                    </option>
                ))}
                </select>
            </div>

            {/* Submit Button (aligned right) */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
                <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-3 rounded-lg font-semibold transition duration-200"
                >
                Submit
                </button>
            </div>
            </form>

            </div>
         </div>
                );
            }

// ✅ Reusable Input Component
function Input({
    name,
    label,
    value,
    onChange,
    type = 'text',
}: {
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}) {
    return (
        <div>
            <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>
    );
}
