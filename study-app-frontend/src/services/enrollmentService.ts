import {studentEnrollment,studentEnrollmentlist} from "@/types/studentEnrollment";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export async function enrollStudent(enroll:studentEnrollment){
    try{
     const response = await axiosInstance.post('/StudentEnrollment/StudentEnroll', enroll);
        return response.data;
    } catch(error:unknown){
        if (axios.isAxiosError(error)) {
            console.error('Axios error adding paper:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error adding paper:', error);
        }
        throw error; // re-throw for the caller to handle
    }

}

export const getAllEnrollStudent = async (): Promise<studentEnrollmentlist[]> => {
    const response = await axiosInstance.get<studentEnrollmentlist[]>(`/StudentEnrollment/GetAllEnrollStudent`);
    return response.data;
};

export const deleteEnrollStudent = async (studentId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/StudentEnrollment/DeleteStudents/${studentId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting paper:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting paper:", error);
        }
        throw error;
    }
};