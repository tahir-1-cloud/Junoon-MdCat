"use client";

import { useEffect, useState } from "react";
import { QuestionService, Question, QuestionCreateDto } from "@/services/QuestionService";
import AddQuestionDrawer from "@/components/admin/AddQuestionDrawer";
import axios from "axios";

export default function PaperQuestions({ paperId }: { paperId: number }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Load all questions
    const loadQuestions = async () => {
        setLoading(true);
        setError("");
        try {
            const list = await QuestionService.getQuestionsForPaper(paperId);
            setQuestions(list);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // err is now typed as AxiosError
                // You can access err.response, err.message, etc.
                setError(err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadQuestions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paperId]);

    // Called by form in AddQuestionDrawer on successful submit
    const handleAddQuestion = async (dto: QuestionCreateDto) => {
        setLoading(true);
        setError("");
        try {
            await QuestionService.addQuestion(dto);
            await loadQuestions();
            setDrawerOpen(false); // Close after successful add
        } catch (err) {
            if (axios.isAxiosError(err)) {
                // err is now typed as AxiosError
                // You can access err.response, err.message, etc.
                setError(err.response?.data || err.message);
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Questions</h2>
                <button
                    onClick={() => setDrawerOpen(true)}
                    className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
                >
                    Add New Question
                </button>
            </div>

            {loading && <div className="text-gray-400">Loading...</div>}
            {error && <div className="text-red-600 py-2">{error}</div>}
            {!loading && questions.length === 0 && (
                <div className="text-gray-500 text-center">No questions added yet.</div>
            )}

            <div className="space-y-8">
                {questions.map((q, idx) => (
                    <div key={q.id} className="border rounded-lg p-4 bg-white shadow font-serif">
                        <div className="font-bold text-lg mb-2">
                            {idx + 1}. {q.title} <span className="ml-2 text-gray-700 text-base font-normal">{q.description}</span>
                        </div>
                        <ul className="mt-2 ml-8 list-none space-y-1">
                            {q.options.map((opt, i) => (
                                <li
                                    key={opt.id}
                                    className={`flex items-center gap-2 ${opt.isCorrect ? "text-green-800 font-semibold" : ""}`}
                                >
                                    <span className="font-bold">{String.fromCharCode(65 + i)}.</span>
                                    <span>{opt.optionText}</span>
                                    {opt.isCorrect && (
                                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">Correct</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* The drawer modal for adding a question */}
            <AddQuestionDrawer
                open={drawerOpen}
                setOpen={setDrawerOpen}
                paperId={paperId}
                onAddQuestion={handleAddQuestion}
                loading={loading}
            />
        </div>
    );
}