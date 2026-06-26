import { api } from '../interface/api'

export const getChatRoomsAPI = async (page: number = 1, limit: number = 20, status?: string) => {
    try {
        const response = await api.get(`/chat/rooms`, {
            params: { page, limit, status }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAdminChatMessagesAPI = async (roomId: string, page: number = 1, limit: number = 50) => {
    try {
        const response = await api.get(`/admin/chat/rooms/${roomId}/messages`, {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const closeChatRoomAPI = async (roomId: string) => {
    try {
        const response = await api.put(`/chat/rooms/${roomId}/close`);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
