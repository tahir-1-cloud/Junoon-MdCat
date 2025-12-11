import {CreateMockTestDto, MockModel,MockTestResults} from "@/types/mocktest";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export async function addMockPaper(mock: CreateMockTestDto) {
    try {
        const response = await axiosInstance.post('/MockTest/AddMockPaper', mock);
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

export const getAllMockPapers = async (): Promise<MockModel[]> => {
    const response = await axiosInstance.get<MockModel[]>(`/MockTest/GetMockPaper`);
    return response.data;
};

export const getAllMockResults = async (): Promise<MockTestResults[]> => {
    const response = await axiosInstance.get<MockTestResults[]>(`/MockTest/GetMockResults`);
    return response.data;
};

export const getMockResultDetail = async (id: number) => {
    const response = await axiosInstance.get(`/MockTest/GetMockTestWithQuestions/${id}`);
    return response.data;
};

export const deletemockResult = async (resultId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/MockTest/DeleteMockResults/${resultId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting Mock Results:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting Mock Results:", error);
        }
        throw error;
    }
};
