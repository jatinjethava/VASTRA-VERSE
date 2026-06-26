import { api } from "../interface/api";

export const getMyRoomAPI = async () => {
    try {
        const response = await api.get(`/chat/my-room`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getChatMessagesAPI = async (roomId: string, page: number = 1, limit: number = 50) => {
    try {
        const response = await api.get(`/chat/rooms/${roomId}/messages`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
