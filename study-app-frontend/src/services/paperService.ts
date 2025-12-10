import {CreatePaperModel, PaperModel} from "@/types/createPaper.model";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";


export interface StudentOptionDto {
  id: number;
  optionText: string;
  isCorrect?: boolean | null;
}

export interface StudentQuestionDto {
  id: number;
  title: string;
  description?: string | null;
  options: StudentOptionDto[];
}

export interface StudentPaperSessionDto {
  paperId: number;
  sessionId: number;
  sessionTitle?: string | null;
}

export interface StudentPaperDto {
  id: number;
  title: string;
  testConductedOn?: string | null;
  sessionId?: number | null;
  sessionTitle?: string | null;
  availableFrom?: string | null;
  availableTo?: string | null;
  durationMinutes?: number | null;
  questions: StudentQuestionDto[];
  paperSessions?: StudentPaperSessionDto[];
}



export async function addPaper(paper: CreatePaperModel) {
    try {
        const response = await axiosInstance.post('/Paper/AddPaper', paper);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error adding paper:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error adding paper:', error);
        }
        throw error; // re-throw for the caller to handle
    }
}

export const getAllPapers = async (): Promise<PaperModel[]> => {
    const response = await axiosInstance.get<PaperModel[]>(`/Paper/GetPapers`);
    return response.data;
};

export const deletePaper = async (paperId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Paper/DeletePaper/${paperId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting paper:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting paper:", error);
        }
        throw error;
    }
};

export const assignPaperToSession = async (paperId: number, sessionId: number): Promise<void> => {
    try {
        await axiosInstance.post("/Paper/AssignToSession", { paperId, sessionId });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error assigning paper:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error assigning paper:", error);
        }
        throw error;
    }
};

export const unassignPaperFromSession = async (paperId: number, sessionId: number): Promise<void> => {
  await axiosInstance.post('/Paper/UnassignFromSession', { paperId, sessionId });
};

export const getStudentPaper = async (paperId: number): Promise<StudentPaperDto> => {
  const { data } = await axiosInstance.get<StudentPaperDto>("/Paper/GetPaperWithQuestionDto", {
    params: { paperId },
  });
  return data;
};