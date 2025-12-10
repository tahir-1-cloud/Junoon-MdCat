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
  message?: string;
  status?: string;
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

export interface GetAttemptForPaperResponse extends StudentAttemptDto {}
export interface StartAttemptModel {
  paperId: number;
  studentId: number;
}

export interface HeartbeatModel {
  attemptId: number;
  studentId: number;
}

export interface CompleteAttemptModel {
  attemptId: number;
  studentId: number;
  // shape depends on your backend; sample answers array:
  answers?: Array<{ questionId: number; selectedOptionId?: number | null; freeText?: string }>;
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





export async function getAttemptForPaper(
  paperId: number,
  studentId: number
): Promise<GetAttemptForPaperResponse> {
  const { data } = await axiosInstance.get<GetAttemptForPaperResponse>(
    `/Student/GetAttemptForPaper`,
    { params: { paperId, studentId } }
  );
  return data;
}

export async function getAttempt(attemptId: number): Promise<StudentAttemptDto> {
  const { data } = await axiosInstance.get<StudentAttemptDto>(`/Student/GetAttempt/${attemptId}`);
  return data;
}

export async function heartbeat(payload: HeartbeatModel): Promise<void> {
  await axiosInstance.post(`/Student/Heartbeat`, payload);
}

export async function completeAttempt(payload: CompleteAttemptModel): Promise<StudentAttemptDto> {
  const { data } = await axiosInstance.post<StudentAttemptDto>(`/Student/CompleteAttempt`, payload);
  return data;
}

export async function saveAnswer(payload: { attemptId: number; studentId: number; questionId: number; selectedOptionId?: number | null; freeText?: string }) {
  const { data } = await axiosInstance.post(`/Student/SaveAnswer`, payload);
  return data;
}
