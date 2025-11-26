"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, BookOpenCheck, ArrowLeftRight } from "lucide-react";

const dummyQuestions = [
  { id: 1, question: "What is Newton's first law?", options: ["Force = Mass × Acc", "Inertia Law", "Action-Reaction", "Gravitation"], correct: 1 },
  { id: 2, question: "Which gas is most abundant in the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 2 },
  { id: 3, question: "2 + 2 × 2 = ?", options: ["8", "6", "4", "10"], correct: 1 },
  { id: 4, question: "Which is a noun?", options: ["Quickly", "Run", "Beautiful", "Table"], correct: 3 },
];

export default function TestPage() {
  const [answers, setAnswers] = useState<number[]>(Array(dummyQuestions.length).fill(-1));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (qIndex: number, optIndex: number) => {
    const newAns = [...answers];
    newAns[qIndex] = optIndex;
    setAnswers(newAns);
  };

  const handleSubmit = () => {
  let correctCount = 0;
  dummyQuestions.forEach((q, i) => {
    if (answers[i] === q.correct) correctCount++;
  });
  setScore(correctCount);
  setSubmitted(true);

  // 👇 Fix: Scroll to top smoothly when result appears
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 100); // small delay for smooth transition
};


  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-100/60 via-white to-yellow-100/40 blur-2xl -z-10"></div>
      <div className="absolute top-10 left-10 w-60 h-60 bg-blue-300/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-yellow-200/40 rounded-full blur-3xl -z-10"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white border border-blue-200 rounded-3xl shadow-2xl p-8 md:p-12 max-w-3xl w-full relative overflow-hidden"
      >
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#22418c] mb-4 drop-shadow-md">
            ✏️ Quick Mock Test
          </h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Test your knowledge and get instant feedback. A quick way to check your entry test readiness!
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-8">
                {dummyQuestions.map((q, i) => (
                  <div
                    key={q.id}
                    className="bg-blue-50/30 border border-blue-100 rounded-2xl p-5 hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold text-gray-800 mb-4 text-lg">
                      {i + 1}. {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelect(i, idx)}
                          className={`text-left border-2 rounded-xl px-4 py-2 transition-all duration-200 font-medium ${
                            answers[i] === idx
                              ? "bg-gradient-to-r from-blue-100 to-blue-200 border-blue-500 text-blue-800 shadow-md"
                              : "border-gray-200 hover:bg-yellow-50 hover:border-yellow-300"
                          }`}
                        >
                          {opt}
                        </button>
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
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-yellow-200 to-blue-100 p-6 rounded-full shadow-lg">
                  <Trophy size={60} className="text-blue-700" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-green-600">
                🎉 You scored {score} / {dummyQuestions.length}
              </h3>

              <p className="text-gray-700 text-lg">
                {score < dummyQuestions.length / 2
                  ? "Keep practicing! You’re getting there. 💪"
                  : "Fantastic work! You’re on track for success 🌟"}
              </p>

              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-left shadow-sm">
                <h4 className="text-blue-700 font-semibold mb-3 flex items-center gap-2">
                  <BookOpenCheck className="text-blue-600" /> Correct Answers
                </h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {dummyQuestions.map((q, i) => (
                    <li key={q.id}>
                      {q.question} —{" "}
                      <span className="text-green-600 font-medium">{q.options[q.correct]}</span>
                    </li>
                  ))}
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
