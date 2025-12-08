export interface Student {
    id: number;
    fullName: string;
    cnic: string;
    phoneNumber: string;
    emailAddress: string;
    address: string;
    dob: string; // ISO string for Date
    fatherName: string;
    password: string;
    sessionId: number;
}

export interface AssignedPaperDto {
  id: number;
  title: string;
  testConductedOn?: string | null;
  sessionId?: number | null;
  sessionTitle?: string | null;
  availableFrom?: string | null;
  availableTo?: string | null;
}

export interface StudentAttemptDto {
  id: number;
  paperId: number;
  studentId: number;
  status: 'InProgress' | 'Completed' | string;
  startedAt?: string | null;
  completedAt?: string | null;
  score?: number | null;
}
