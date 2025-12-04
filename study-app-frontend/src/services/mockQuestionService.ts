import axiosInstance from "./axiosInstance";

export interface MockOptionDto {
    optionText: string;
    isCorrect: boolean;
}

export interface MockQuestionCreateDto {
    mockTestId: number;
    title: string;
    description: string;
    mockOptions : MockOptionDto[];
}

export interface MockOption {
    id: number;
    optionText: string;
    isCorrect: boolean;
}

export interface MockQuestion {
    id: number;
    title: string;
    description: string;
    mockOptions: MockOption[];
}

export const mockQuestionService = {
    async addQuestion(dto: MockQuestionCreateDto): Promise<MockQuestion> {
        const { data } = await axiosInstance.post<MockQuestion>("/MockTest/AddMockQuestion", dto);
        return data;
    },

    async getQuestionsForPaper(mockPaperId: number): Promise<MockQuestion[]> {
        const { data } = await axiosInstance.get<MockQuestion[]>(
            `/MockTest/GetMockQuestionsForPaper/${mockPaperId}`
        );
        return data;
    },
    // async deleteQuestion(questionId: number): Promise<void> {
    //     await axiosInstance.delete(`/Question/DeleteQuestion/${questionId}`);
    // }

};
