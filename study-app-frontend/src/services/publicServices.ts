import {contactus,subscriber} from "@/types/contactus";
import axiosInstance from "@/services/axiosInstance";
import axios from "axios";


export async function addcontactinfo(contact: contactus) {
    try {
        const response = await axiosInstance.post('/Public/AddContactInfo',contact);
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

export async function addsubscriber(sub: subscriber) {
    try {
        const response = await axiosInstance.post('/Public/AddSubscriber',sub);
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

export const getAllContactInfo = async (): Promise<contactus[]> => {
    const response = await axiosInstance.get<contactus[]>(`/Public/GetContactInfo`);
    return response.data;
};

export const getAllSubscriber = async (): Promise<subscriber[]> => {
    const response = await axiosInstance.get<subscriber[]>(`/Public/GetSubscriber`);
    return response.data;
};

export const deleteContactInfo = async (contactId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Public/DeleteContactInformation/${contactId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting paper:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting paper:", error);
        }
        throw error;
    }
};

export const deleteSubscriber = async (subscriberId: number): Promise<void> => {
    try {
        await axiosInstance.delete(`/Public/DeleteSubscriber/${subscriberId}`);
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Error deleting paper:", error.response?.data || error.message);
        } else {
            console.error("Unexpected error deleting paper:", error);
        }
        throw error;
    }
};