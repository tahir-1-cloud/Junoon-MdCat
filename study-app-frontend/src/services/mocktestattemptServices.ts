import {MocktestCounts} from "@/types/mocktest";
import axiosInstance from "@/services/axiosInstance";
import { MockQuestion, SubmitTestDto, TestResult } from "@/types/mocktest";
import axios from "axios";

export const getAllMockTestCount = async (): Promise<MocktestCounts[]> => {
    const response = await axiosInstance.get<MocktestCounts[]>(`/MockTest/GetAllMockTests`);
    return response.data;
};


export const getQuestionsByTestId = async (mockTestId: number): Promise<MockQuestion[]> => {
  const response = await axiosInstance.get<MockQuestion[]>(`/MockTest/GetMockQuestionsForPaper/${mockTestId}`);
  return response.data;
};

export const submitTest = async (dto: SubmitTestDto): Promise<TestResult> => {
  const response = await axiosInstance.post<TestResult>(`/MockTest/AttemptMockTest`, dto);
  return response.data;
};