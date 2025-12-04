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