"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, BookOpenCheck, ArrowLeftRight } from "lucide-react";
import { getQuestionsByTestId, submitTest } from "@/services/mocktestattemptServices";
import { MockQuestion, SubmitAnswer, TestResult } from "@/types/mocktest";
import Link from "next/link";
import Swal from "sweetalert2";

interface TestPageProps {
  mockTestId: number;
}

export default function TestPage({ mockTestId }: TestPageProps) {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<SubmitAnswer[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<number | null>(null); // store interval ID

  useEffect(() => {
    if (!loading && !timerActive) {
      setTimerActive(true);
    }
  }, [loading, timerActive]);

  useEffect(() => {
    if (!timerActive) return;

    if (timeLeft <= 0) {
      stopTimer();
      Swal.fire({
        icon: "warning",
        title: "Time's up!",
        text: "Your 10 minutes are over. Retry the test.",
        confirmButtonText: "Retry",
      }).then(() => {
        window.location.reload();
      });
      return;
    }

    if (!timerRef.current) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => stopTimer();
  }, [timeLeft, timerActive]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestionsByTestId(mockTestId);
        setQuestions(data);
        setAnswers(data.map(q => ({ questionId: q.id, optionId: -1 })));
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load questions", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [mockTestId]);

  const handleSelect = (qIndex: number, optionId: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = { questionId: questions[qIndex].id, optionId };
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.some(a => a.optionId === -1)) {
      Swal.fire("Incomplete", "Please attempt all questions before submitting.", "warning");
      return;
    }

    try {
      stopTimer(); // ✅ Stop timer when submitting
      const dto = { mockTestId, answers };
      const res = await submitTest(dto);
      setResult(res);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong while submitting your test.", "error");
    }
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading questions...</p>;

  const optionLabels = ["A", "B", "C", "D", "E"];

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/60 via-white to-yellow-100/40 blur-2xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white border border-blue-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
            ✏️ Mock Test
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Attempt this mock test with a professional, entry-test-ready interface, and enroll to achieve 100% preparation.
          </p>
        </div>
        <div className="text-right mb-6 text-xl font-bold text-red-600">
          ⏱ Time Left: {formatTime(timeLeft)}
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div key="questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="space-y-6">
                {questions.map((q, i) => (
                  <div key={i} className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-gray-800 mb-4 text-lg">{i + 1}. {q.title}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.mockOptions.map((opt, idx) => (
                        <label
                          key={opt.id}
                          className={`flex items-center gap-3 border-2 rounded-xl px-4 py-2 transition-all duration-200 cursor-pointer ${
                            answers[i]?.optionId === opt.id
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-500 text-blue-800 shadow-md"
                              : "border-gray-200 hover:bg-yellow-50 hover:border-yellow-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${i}`}
                            value={opt.id}
                            checked={answers[i]?.optionId === opt.id}
                            onChange={() => handleSelect(i, opt.id)}
                            className="accent-blue-600"
                          />
                          <span className="font-medium">{optionLabels[idx]}. {opt.optionText}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-3 rounded-full font-semibold text-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Submit Test
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-yellow-200 to-blue-100 p-6 rounded-full shadow-lg">
                  <Trophy size={60} className="text-blue-700" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-green-600">
                🎉 You scored {result?.correct} / {result?.total} ({result?.percentage}%)
              </h3>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left shadow-sm">
                <h4 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
                  <BookOpenCheck className="text-blue-600" /> Correct Answers
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {questions.map((q, i) => {
                    const userAnswer = answers[i]?.optionId;
                    const correctOption = q.mockOptions.find(opt => opt.isCorrect);
                    return (
                      <li key={i}>
                        {q.title} —{" "}
                        <span className={`${userAnswer === correctOption?.id ? "text-green-600" : "text-red-600 font-medium"}`}>
                          {correctOption?.optionText}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Link
                href="/enrollment"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300"
              >
                <ArrowLeftRight size={20} /> Enroll for Complete Preparation
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
