// src/types/attempt.ts
export interface OptionDto {
  id: number;
  optionText: string;
}

export interface QuestionDto {
  questionId: number; // matches API JSON
  title: string;
  options: OptionDto[];
}

export interface AttemptDto {
  id: number;
  paperId: number;
  studentId: number;
  attemptedOn: string;      // ISO string from API
  startedAt?: string | null;
  completedAt?: string | null;
  status: 'InProgress' | 'Completed' | string;
  score: number;
  durationMinutes: number;  // NOTE: lowercase 'durationMinutes'
  questions: QuestionDto[];
  savedAnswers?: Array<{ questionId: number; selectedOptionId?: number | null; isMarkedForReview?: boolean }>;
}
