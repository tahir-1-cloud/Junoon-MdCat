'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Spin, Card, Tag, Divider, Button } from 'antd';
import { Trophy, BookOpenCheck, ArrowLeftRight } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { getAttemptResult } from '@/services/attemptService';

export default function AttemptResults({ params }: { params: { attemptId?: string } | Promise<{ attemptId?: string }> }) {
  const raw = (params as any)?.attemptId;
  const attemptId = raw ? Number(raw) : NaN;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ref for printing
  const printRef = useRef<HTMLDivElement | null>(null);

  // NOTE: some versions of react-to-print type the options differently.
  // Casting to `any` here avoids TypeScript errors while keeping runtime behavior.
  const handlePrint = useReactToPrint(({
    content: () => printRef.current,
    documentTitle: `AttemptResult-${attemptId}`,
  } as any));

  useEffect(() => {
    if (Number.isNaN(attemptId)) {
      setError('Invalid attempt id');
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      setLoading(true);
      try {
        const data = await getAttemptResult(attemptId);
        setResult(data);
      } catch (err: any) {
        console.error('fetch result failed', err);
        setError(String(err.message || err));
      } finally {
        setLoading(false);
      }
    };

    void fetchResult();
  }, [attemptId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-8">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-6 flex justify-center">
        <div className="w-full max-w-4xl">
          <Card>
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error ?? 'No result available.'}</p>
              <div>
                <Button onClick={() => router.replace('/student/exams/listing')}>Back to tests</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const total = result.total ?? result.questions?.length ?? 0;
  const correct = result.correct ?? 0;
  const percentage = result.percentage ?? (total ? Math.round((correct / total) * 100) : 0);

  return (
    <>
      {/* Print-specific styles: hide buttons and other UI chrome */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact;
            background: white !important;
          }
          .no-print, button, .ant-btn {
            display: none !important;
          }
          /* Make printed cards use full width */
          .print-container {
            max-width: 100% !important;
            box-shadow: none !important;
            background: white !important;
          }
        }
      `}</style>

      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center px-4 py-10">
        {/* This wrapper is what will be printed */}
        <div className="max-w-4xl w-full print-container" ref={printRef}>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-4 bg-gradient-to-r from-yellow-200 to-blue-100 p-6 rounded-full shadow-lg mx-auto">
              <Trophy size={48} className="text-blue-700" />
              <div className="text-left">
                <h2 className="text-3xl font-extrabold text-[#22418c]">Test Results</h2>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <Card className="mb-4" bordered>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{correct} / {total}</h3>
                    <p className="text-sm text-gray-600">Correct answers</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-green-600">{percentage}%</div>
                    <div className="text-xs text-gray-500">Score</div>
                  </div>
                </div>
              </Card>

              <Card className="mb-4" bordered>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpenCheck /> Questions & answers
                </h4>

                <div className="space-y-4">
                  {result.questions?.map((q: any, i: number) => {
                    const userOptionId = q.userOptionId ?? q.userSelectedOptionId ?? null;
                    const correctOption = (q.options ?? []).find((o: any) => o.isCorrect);
                    const isUserCorrect = userOptionId && correctOption && Number(userOptionId) === Number(correctOption.id);
                    return (
                      <div key={q.questionId ?? i} className="p-4 border rounded-lg bg-white/60">
                        <div className="font-medium mb-2">{i + 1}. {q.title}</div>
                        <div className="text-sm">
                          Your answer:{' '}
                          <span className={isUserCorrect ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {(() => {
                              const userOpt = (q.options ?? []).find((o: any) => Number(o.id) === Number(userOptionId));
                              return userOpt ? userOpt.optionText : 'No answer';
                            })()}
                          </span>
                        </div>
                        <div className="text-sm mt-1">
                          Correct answer: <span className="text-green-700 font-medium">{correctOption?.optionText ?? '—'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            <aside style={{ width: 320 }}>
              <Card className="mb-4" bordered>
                <div className="text-sm text-gray-700">
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <div>
                      {result.status === 'Completed' ? <Tag color="green">Completed</Tag> : <Tag>{result.status}</Tag>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <strong>Attempted On:</strong>
                    <div>{result.attemptedOn ? new Date(result.attemptedOn).toLocaleString() : '—'}</div>
                  </div>

                  <div className="mb-3">
                    <strong>Duration:</strong>
                    <div>{result.durationMinutes ? `${result.durationMinutes} minutes` : 'N/A'}</div>
                  </div>

                  <Divider />

                  <div className="text-center no-print">
                    <Button block onClick={() => router.replace('/student/exams/listing')}>
                      Back to tests
                    </Button>
                    <div style={{ height: 8 }} />
                    <Button block type="primary" onClick={handlePrint}>
                      Print / Download
                    </Button>
                  </div>
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
