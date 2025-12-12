'use client';

import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import {toast} from "sonner"
import Link from "next/link";

import {
  QuestionCreateDto,
  OptionDto,
  QuestionService,
} from '@/services/QuestionService';

export default function AddQuestionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<OptionDto[]>([
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // NOTE: you were using a fixed paperId in the original file — keeping that
  const paperId = 1;

  const updateOption = (idx: number, data: Partial<OptionDto>) => {
    const updated = [...options];
    updated[idx] = { ...updated[idx], ...data };
    setOptions(updated);
  };

  const addOption = () => setOptions([...options, { optionText: '', isCorrect: false }]);

  const deleteOption = (idx: number) => {
    if (options.length <= 2) {
      setError('At least two options are required.');
      return;
    }

    const updated = options.filter((_, i) => i !== idx);
    const hasCorrect = updated.some((opt) => opt.isCorrect);
    const cleaned = hasCorrect ? updated : updated.map((opt, i) => ({ ...opt, isCorrect: i === 0 }));
    setOptions(cleaned);
  };

  const handleRadioChange = (idx: number) => {
    setOptions(
      options.map((opt, i) => ({
        ...opt,
        isCorrect: i === idx,
      }))
    );
  };

  // === FIXED: submit actually posts to API ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // client-side validation
    if (options.filter((opt) => opt.isCorrect).length !== 1) {
      setError('You must mark exactly one option as correct.');
      return;
    }
    if (!title.trim()) {
      setError('Question title is required.');
      return;
    }
    if (options.some((opt) => !opt.optionText.trim())) {
      setError('All option texts are required.');
      return;
    }

    setError('');
    setLoading(true);

    const dto: QuestionCreateDto = { paperId, title, description, options };

    try {
      // Call your backend API via the existing service
      // This will POST to /Question/AddQuestion
      await QuestionService.addQuestion(dto);

      // success feedback
      toast.success('Question saved successfully!');

      // reset form
      setTitle('');
      setDescription('');
      setOptions([
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
      ]);
    } catch (err: any) {
      console.error('Error saving question', err);
      // prefer server-provided message if available
      const serverMsg = err?.response?.data ?? err?.message ?? String(err);
      setError(typeof serverMsg === 'string' ? serverMsg : 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };
  // === end submit fix ===

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-8">
      {/* Header */}
     <div className="max-w-4xl mx-auto mb-8">
      {/* Back Button */}
      <div className="mb-4">
      <Link
        href="/admin/paper/listing"
        className="px-4 py-2 rounded-lg font-semibold text-blue-900"
        style={{ backgroundColor: '#ffdf20' }}
      >
        ← Back
      </Link>
    </div>

      {/* Title + Description */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
          ✏️ Create a New Question
        </h1>
        <p className="text-gray-600 text-lg">
          Add a title, description, and multiple-choice options below.
        </p>
      </div>
     </div>


      {/* Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-indigo-100">
        {error && (
          <div className="mb-4 bg-red-100 text-red-800 px-4 py-2 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Title */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-indigo-900">Question Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 text-lg border border-indigo-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 bg-indigo-50/40"
              placeholder="e.g., What is the capital of France?"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-lg font-semibold text-indigo-900">Description (optional):</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-20 px-4 py-3 text-lg border border-indigo-200 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-200 bg-indigo-50/40"
              placeholder="Add context or explanation if needed..."
            />
          </div>

          {/* Options */}
          <div>
            <div className="mb-4 text-lg font-semibold text-indigo-900">Options (select one correct):</div>
            <div className="space-y-3">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-gradient-to-r from-white via-indigo-50 to-purple-50 border border-indigo-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span className="font-bold text-indigo-700">{String.fromCharCode(65 + idx)}.</span>

                  <input
                    type="text"
                    value={opt.optionText}
                    onChange={(e) => updateOption(idx, { optionText: e.target.value })}
                    className="flex-1 text-lg px-3 py-2 border border-indigo-200 rounded-lg bg-white shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
                    <span className="text-indigo-700 font-medium">Correct</span>
                  </label>

                  {/* Stylish Delete Button */}
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => deleteOption(idx)}
                      title="Delete this option"
                      className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addOption}
              className="mt-4 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md transition-transform transform hover:-translate-y-0.5"
            >
              + Add Another Option
            </button>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-blue-600 text-white text-xl font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? 'Saving...' : '✨ Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
