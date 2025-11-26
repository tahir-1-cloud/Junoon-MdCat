import axiosInstance from "@/services/axiosInstance";
import { Session } from "@/types/session";

export const getActiveSessions = async (): Promise<Session[]> => {
    const response = await axiosInstance.get<Session[]>(`/Session/GetActiveSession`);
    return response.data;
};

export const getAllSessions = async (): Promise<Session[]> => {
    const response = await axiosInstance.get<Session[]>(`/Session/GetSession`);
    return response.data;
};

export const addSession = async (session: Session) => {
    const response = await axiosInstance.post(`/Session/AddSession`, session);
    return response.data;
};