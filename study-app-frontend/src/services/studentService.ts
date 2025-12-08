// src/services/studentService.ts
import axiosInstance from './axiosInstance';

export interface AssignedPaperDto {
  id: number; // paper id
  title: string;
  testConductedOn?: string | null;
  sessionId?: number | null;
  sessionTitle?: string | null;
  availableFrom?: string | null; // optional window
  availableTo?: string | null;
}

export interface StartAttemptResponse {
  attemptId: number;
}

export interface StudentAttemptDto {
  id: number;
  paperId: number;
  studentId: number;
  status: 'InProgress' | 'Completed' | 'NotStarted' | string;
  startedAt?: string | null;
  completedAt?: string | null;
  score?: number | null;
}

export async function getAssignedPapersForStudent(studentId: number): Promise<AssignedPaperDto[]> {
  const { data } = await axiosInstance.get<AssignedPaperDto[]>(`/Paper/GetAssignedPapers/${studentId}`);
  return data;
}

export async function getAttemptsForStudent(studentId: number): Promise<StudentAttemptDto[]> {
  const { data } = await axiosInstance.get<StudentAttemptDto[]>(`/Paper/GetAttempts/${studentId}`);
  return data;
}

export async function startAttempt(payload: { paperId: number; studentId: number }): Promise<StartAttemptResponse> {
  const { data } = await axiosInstance.post<StartAttemptResponse>('/Paper/StartAttempt', payload);
  return data;
}
