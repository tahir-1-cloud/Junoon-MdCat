import {LecturesModel} from "@/types/lecturesModel";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";

export async function Addpubliclectures(data: FormData) {
    try {
        const response = await axiosInstance.post('/PublicLectures/AddLecture', data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    } catch (error) {
        console.error('Axios error adding lecture:', error);
        throw error;
    }
}

export const getLectures = async (): Promise<LecturesModel[]> => {
    const response = await axiosInstance.get<LecturesModel[]>(`/PublicLectures/GetAlllectures`);
    return response.data;
};
