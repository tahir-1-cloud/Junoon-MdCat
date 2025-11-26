"use client"

import { useState } from "react";

interface Option {
    option_text: string;
    is_correct: boolean;
}

interface AddQuestionProps {
    paperId: number;
}

export default function AddQuestion({ paperId }: AddQuestionProps) {
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState<Option[]>([
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false }
    ]);

    const updateOption = (idx: number, data: Partial<Option>) => {
        const updated = [...options];
        updated[idx] = { ...updated[idx], ...data };
        setOptions(updated);
    };

    const addOption = () =>
        setOptions([...options, { option_text: "", is_correct: false }]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/questions", {
            method: "POST",
            body: JSON.stringify({
                paper_id: paperId,
                text: questionText,
                options
            }),
            headers: { "Content-Type": "application/json" }
        });
        // Optionally reset form
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-xl mx-auto mt-8 p-8 bg-[#faf9f6] rounded-xl shadow-md space-y-8 font-serif"
        >
            <div className="border-2 border-gray-400 rounded-lg p-6 bg-white">
                <label className="block mb-4 text-lg font-semibold text-gray-900">
                    Write Question:
                </label>
                <textarea
                    value={questionText}
                    onChange={e => setQuestionText(e.target.value)}
                    className="w-full h-20 px-3 py-2 text-lg border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 font-serif"
                    placeholder="Type the question as it would appear on paper"
                    required
                />
            </div>
            <div className="border-2 border-gray-400 rounded-lg p-6 bg-white">
                <div className="mb-4 text-lg font-semibold text-gray-900">Options:</div>
                {options.map((opt, idx) => (
                    <div
                        key={idx}
                        className="flex items-center gap-4 mb-3 border-b border-dotted border-gray-300 pb-2"
                    >
                        <span className="text-lg font-bold">{String.fromCharCode(65 + idx)}.</span>
                        <input
                            type="text"
                            value={opt.option_text}
                            onChange={e =>
                                updateOption(idx, { option_text: e.target.value })
                            }
                            className="flex-1 text-lg px-2 py-1 border rounded-lg bg-gray-50 font-serif"
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            required
                        />
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={opt.is_correct}
                                onChange={e =>
                                    updateOption(idx, { is_correct: e.target.checked })
                                }
                                className="w-5 h-5 rounded border-gray-400 accent-indigo-600"
                            />
                            Mark Correct
                        </label>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addOption}
                    className="mt-4 px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
                >
                    Add Option
                </button>
            </div>
            <div className="text-center">
                <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition shadow"
                >
                    Save Question
                </button>
            </div>
        </form>
    );
}
