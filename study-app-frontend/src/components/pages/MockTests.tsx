// components/MockTests.tsx
"use client";

import Link from "next/link";

const mockTests = [
    { id: 1, subject: "Physics - Motion & Laws", questions: 10, duration: "15 min", difficulty: "Medium" },
    { id: 2, subject: "Chemistry - Atomic Structure", questions: 10, duration: "15 min", difficulty: "Easy" },
    { id: 3, subject: "Mathematics - Algebra Basics", questions: 10, duration: "20 min", difficulty: "Hard" },
    { id: 4, subject: "English - Grammar Test", questions: 10, duration: "10 min", difficulty: "Medium" },
];

const MockTests = () => {
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
                        <h3 className="text-xl font-semibold text-blue-600 mb-2">{test.subject}</h3>
                        <p className="text-gray-600 text-sm mb-1">🧮 {test.questions} Questions</p>
                        <p className="text-gray-600 text-sm mb-1">⏱ {test.duration}</p>
                        <p className="text-gray-600 text-sm mb-3">🎯 {test.difficulty} Level</p>

                        <Link href="/assessment">
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
