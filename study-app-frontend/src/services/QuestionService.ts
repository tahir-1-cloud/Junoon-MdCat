import axiosInstance from "./axiosInstance";

export interface OptionDto {
    optionText: string;
    isCorrect: boolean;
}

export interface QuestionCreateDto {
    paperId: number;
    title: string;
    description: string;
    options: OptionDto[];
}

export interface Option {
    id: number;
    optionText: string;
    isCorrect: boolean;
}

export interface Question {
    id: number;
    title: string;
    description: string;
    options: Option[];
}

export const QuestionService = {
    async addQuestion(dto: QuestionCreateDto): Promise<Question> {
        const { data } = await axiosInstance.post<Question>("/Question/AddQuestion", dto);
        return data;
    },

    async getQuestionsForPaper(paperId: number): Promise<Question[]> {
        const { data } = await axiosInstance.get<Question[]>(
            `/Question/GetQuestionsForPaper/${paperId}`
        );
        return data;
    }
};
