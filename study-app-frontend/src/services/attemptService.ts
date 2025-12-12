// src/services/attemptService.ts
import axiosInstance from './axiosInstance'; // your existing instance
import type { AttemptDto } from '@/types/attempt';

export interface SaveAnswerModel {
  attemptId: number;
  questionId: number;
  selectedOptionId?: number | null;
  markForReview?: boolean;
}

export interface CompleteAttemptModel {
  attemptId: number;
  studentId: number;
  answers?: Array<{ questionId: number; selectedOptionId?: number | null; freeText?: string }>;
}


export interface OptionResult {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

export interface QuestionResult {
  questionId: number;
  title: string;
  options: OptionResult[];
  userOptionId?: number | null;     // may be named userSelectedOptionId in some responses
  explanation?: string | null;
}

export interface AttemptResultDto {
  attemptId: number;
  studentId: number;
  status: string;
  total: number;
  correct: number;
  percentage: number;
  durationMinutes?: number | null;
  attemptedOn?: string | null; // ISO date string
  questions: QuestionResult[];
}


export async function getAttempt(attemptId: number): Promise<AttemptDto> {
  const { data } = await axiosInstance.get<AttemptDto>(`/Paper/GetAttempt/${attemptId}`);
  return data;
}

export async function saveAnswer(model: SaveAnswerModel): Promise<void> {
  await axiosInstance.post('/Paper/SaveAnswer', model);
}

export async function completeAttempt(model: CompleteAttemptModel): Promise<AttemptDto> {
  const { data } = await axiosInstance.post<AttemptDto>('/Paper/CompleteAttempt', model);
  return data;
}

export async function getAttemptResult(attemptId: number): Promise<AttemptResultDto> {
  if (!attemptId || Number.isNaN(attemptId)) {
    throw new Error('Invalid attemptId');
  }
  const { data } = await axiosInstance.get<AttemptResultDto>(`/paper/GetAttemptResult/${attemptId}/result`);
  return data;
}