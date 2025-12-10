export interface CreateMockTestDto {
    title: string;
    testConductedOn: Date;
}

export interface MockModel {
    id: number; // From AuditEntity
    title: string;
    testConductedOn: Date; // Can also use string if it's serialized as ISO date from backend
    questions: MockQuestionModel[];
}

export interface MockQuestionModel{
    id: number;
}



export interface MockOption {
  id: number;
  optionText: string;
  isCorrect: boolean;
}

export interface MockQuestion {
  id: number;  
  mockTestId: number;
  title: string;
  description?: string;
  mockOptions: MockOption[];
}
export interface MocktestCounts{
    id: number;
    title:string;
    totalQuestions:number
}

export interface SubmitAnswer {
  questionId: number;
  optionId: number;
}

export interface SubmitTestDto {
  mockTestId: number;
  answers: SubmitAnswer[];
}

export interface TestResult {
  mockTestId: number;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
}


export interface MockTestResults {
  id: number;
  correct: number;
  incorrect: number;
  total: number;
  percentage: number;
}

export interface MockTestAnswerDetail {
    questionText: string;
    selectedOption: string;
    correctOption: string;
    isCorrect: boolean;
}

export interface MockTestResultDetail {
    testResultId: number;
    mockTestId: number;
    correct: number;
    incorrect: number;
    total: number;
    percentage: number;
    attemptDate: string;
    details: MockTestAnswerDetail[];
}
