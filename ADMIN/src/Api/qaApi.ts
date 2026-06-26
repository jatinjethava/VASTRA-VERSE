import axios from 'axios';
import { api } from '../interface/api'

export interface QA {
    _id: string;
    title: string;
    question: string;
    answer: string;
    productId: string;
    userId: string;
    user: {
        name: string;
        email: string;
    }
    product?: {
        _id: string;
        title: string;
        images?: string[];
    }
    isAnswered: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export const getAllQuestions = async (): Promise<QA[]> => {
    try {
        const { data } = await api.get("/get-all-questions");

        if (!data.success) {
            throw new Error(data.message || "Failed to fetch questions");
        }

        return data.data.result;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to fetch questions");
        } else {
            throw error;
        }
    }
}

export const answerQuestion = async ({ questionId, answer }: { questionId: string, answer: string }) => {
    try {
        const { data } = await api.post(`/answer-question`, { questionId, answer });

        if (!data.success) {
            throw new Error(data.message || "Failed to answer question");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to answer question");
        } else {
            throw error;
        }
    }
}

export const deleteQuestion = async (id: string) => {
    try {
        const { data } = await api.delete(`/delete-question/${id}`);

        if (!data.success) {
            throw new Error(data.message || "Failed to delete question");
        }

        return data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || "Failed to delete question");
        } else {
            throw error;
        }
    }
}