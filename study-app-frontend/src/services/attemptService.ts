// src/services/attemptService.ts
import axiosInstance from './axiosInstance'; // your existing instance
import type { AttemptDto } from '@/types/Attempt';

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
