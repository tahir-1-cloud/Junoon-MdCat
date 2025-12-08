"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllMockTestCount } from "@/services/mocktestattemptServices"; // your API service
import {MocktestCounts} from "@/types/mocktest";
const MockTests = () => {
    const [mockTests, setMockTests] = useState<MocktestCounts[]>([]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const data = await getAllMockTestCount();
                setMockTests(data);
            } catch (error) {
                console.error("Error fetching mock tests:", error);
            }
        };

        fetchTests();
    }, []);

    return (
        <section className="bg-blue-50 py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-6 drop-shadow-md">
                    Practice Mock Tests
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-12 max-w-2xl mx-auto">
                    Sharpen your skills and boost confidence with realistic entry test mock exams designed to prepare you for success.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                    {mockTests.map((test) => (
                        <div
                            key={test.id}
                            className="bg-white border-2 border-blue-400 hover:border-blue-600 rounded-2xl shadow-md hover:shadow-lg transition transform hover:-translate-y-1 p-6 text-center"
                        >
                            <h3 className="text-xl font-semibold text-blue-600 mb-2">{test.title}</h3>
                            <p className="text-gray-600 text-sm mb-1">🧮 {test.totalQuestions} Questions</p>
                            <p className="text-gray-600 text-sm mb-1">⏱ 10 min</p> {/* Hardcoded */}
                            <p className="text-gray-600 text-sm mb-3">🎯 Medium Level</p> {/* Hardcoded */}

                            <Link href={`/assessment/${test.id}`}>
                                <button className="bg-blue-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-blue-700 transition">
                                    Start Test
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MockTests;
