import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { QuestionCreateDto, OptionDto } from "@/services/QuestionService";

interface AddQuestionDrawerProps {
    open: boolean;
    setOpen: (val: boolean) => void;
    paperId: number;
    onAddQuestion: (dto: QuestionCreateDto) => void;
    loading?: boolean;
}

export default function AddQuestionDrawer({
                                              open,
                                              setOpen,
                                              paperId,
                                              onAddQuestion,
                                              loading = false
                                          }: AddQuestionDrawerProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState<OptionDto[]>([
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false },
        { optionText: "", isCorrect: false }
    ]);
    const [error, setError] = useState("");

    const updateOption = (idx: number, data: Partial<OptionDto>) => {
        const updated = [...options];
        updated[idx] = { ...updated[idx], ...data };
        setOptions(updated);
    };

    const addOption = () =>
        setOptions([...options, { optionText: "", isCorrect: false }]);

    const handleRadioChange = (idx: number) => {
        setOptions(options.map((opt, i) => ({
            ...opt,
            isCorrect: i === idx
        })));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation: ensure one correct
        if (options.filter(opt => opt.isCorrect).length !== 1) {
            setError("You must mark exactly one option as correct.");
            return;
        }
        if (!title.trim()) {
            setError("Question title is required.");
            return;
        }
        if (options.some(opt => !opt.optionText.trim())) {
            setError("All option texts are required.");
            return;
        }
        setError("");
        const dto: QuestionCreateDto = {
            paperId,
            title,
            description,
            options
        };
        onAddQuestion(dto); // controlled by parent
        // Optionally, clear form (if drawer stays open)
        setTitle("");
        setDescription("");
        setOptions([
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false }
        ]);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="fixed inset-0 z-50">
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setOpen(false)} />
            {/* Side Canvas Drawer */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-[#f9fafb] shadow-xl z-50 transition-all duration-300 ease-in">
                <Dialog.Panel className="h-full flex flex-col">
                    <div className="flex justify-between items-center p-6 border-b bg-white">
                        <Dialog.Title className="text-xl font-bold">Add New Question</Dialog.Title>
                        <button onClick={() => setOpen(false)} className="text-gray-600 hover:text-gray-900 text-2xl">&times;</button>
                    </div>
                    <form
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto p-6 space-y-8"
                    >
                        {error && <div className="text-red-600">{error}</div>}
                        <div>
                            <label className="block mb-2 text-lg font-semibold text-gray-900">
                                Question Title:
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className="w-full px-3 py-2 text-lg border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 font-serif"
                                placeholder="Enter question title"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-lg font-semibold text-gray-900">
                                Description (optional):
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                className="w-full h-16 px-3 py-2 text-lg border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 font-serif"
                                placeholder="Extra details if needed"
                            />
                        </div>
                        <div>
                            <div className="mb-2 text-lg font-semibold text-gray-900">Options (choose one correct):</div>
                            {options.map((opt, idx) => (
                                <div key={idx} className="flex items-center gap-4 mb-3">
                                    <span className="font-bold">{String.fromCharCode(65 + idx)}.</span>
                                    <input
                                        type="text"
                                        value={opt.optionText}
                                        onChange={e =>
                                            updateOption(idx, { optionText: e.target.value })
                                        }
                                        className="flex-1 text-lg px-2 py-1 border rounded-lg bg-gray-50 font-serif"
                                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                        required
                                    />
                                    <label className="flex items-center gap-1 text-sm text-gray-600">
                                        <input
                                            type="radio"
                                            name="correctOption"
                                            checked={opt.isCorrect}
                                            onChange={() => handleRadioChange(idx)}
                                            className="w-5 h-5 accent-indigo-600"
                                        />
                                        Correct
                                    </label>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOption}
                                className="mt-2 px-4 py-2 rounded-md bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition"
                            >
                                Add Option
                            </button>
                        </div>
                        <div className="py-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white text-lg font-semibold hover:bg-indigo-700 transition shadow"
                            >
                                {loading ? "Saving..." : "Save Question"}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
