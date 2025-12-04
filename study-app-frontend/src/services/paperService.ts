import {CreatePaperModel, PaperModel} from "@/types/createPaper.model";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

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