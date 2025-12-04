import axiosInstance from './axiosInstance';
import {LoginModel, LoginResponse} from "@/types/auth";
import {Student} from "@/types/student";

export const loginStudent = async (data: LoginModel): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(`/Authentication/LoginStudent`, data);
    return response.data;
};

export const addStudent = async (student: Student) => {
    const response = await axiosInstance.post(`/Authentication/AddStudent`, student);
    return response.data;
};

export const getAllStudents = async (): Promise<Student[]> => {
    const response = await axiosInstance.get(`/Authentication/GetAllStudents`);
    return response.data;
};