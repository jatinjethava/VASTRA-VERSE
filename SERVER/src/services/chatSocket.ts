import { Server, Socket } from "socket.io";
import { ChatRoomModel, ChatMessageModel } from "../models";

export const registerChatHandlers = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        const user = (socket as any).user;
        console.log(`[Chat] Socket connected: ${socket.id}, userId: ${user?._id}`);

        socket.on("chat:join", async () => {
            try {
                if (!user?._id) {
                    socket.emit("chat:error", { message: "Unauthorized" });
                    return;
                }

                let room = await ChatRoomModel.findOne({ customer: user._id, status: "open" } as any);

                if (!room) {
                    room = await new ChatRoomModel({ customer: user._id }).save();
                    io.emit("chat:new-room", {
                        roomId: room._id,
                        customer: user._id,
                        createdAt: room.createdAt,
                    });
                }

                socket.join(room._id.toString());
                socket.emit("chat:joined", {
                    roomId: room._id,
                    status: room.status,
                    lastMessage: room.lastMessage,
                });
            } catch (error) {
                console.error("[Chat] chat:join error:", error);
                socket.emit("chat:error", { message: "Failed to join chat room" });
            }
        });

        socket.on("chat:admin-join", async (data: { roomId: string }) => {
            try {
                if (user?.role !== "admin") {
                    socket.emit("chat:error", { message: "Access denied" });
                    return;
                }

                const room = await ChatRoomModel.findById(data.roomId);
                if (!room) {
                    socket.emit("chat:error", { message: "Room not found" });
                    return;
                }

                socket.join(room._id.toString());
                socket.emit("chat:joined", {
                    roomId: room._id,
                    status: room.status,
                    lastMessage: room.lastMessage,
                });
            } catch (error) {
                console.error("[Chat] chat:admin-join error:", error);
                socket.emit("chat:error", { message: "Failed to join chat room" });
            }
        });

        socket.on("chat:message", async (data: { roomId: string; message: string }) => {
            try {
                const isAdmin = user?.role === "admin";
                if (!data.roomId || !data.message?.trim() || (!user?._id && !isAdmin)) {
                    socket.emit("chat:error", { message: "Invalid message data" });
                    return;
                }

                const room = await ChatRoomModel.findById(data.roomId);
                if (!room) {
                    socket.emit("chat:error", { message: "Room not found" });
                    return;
                }

                if (room.status === "closed") {
                    socket.emit("chat:error", { message: "This chat room is closed" });
                    return;
                }

                const senderType: "customer" | "admin" = isAdmin ? "admin" : "customer";

                const chatMessage = await new ChatMessageModel({
                    roomId: room._id,
                    sender: isAdmin ? undefined : user._id,
                    senderType,
                    message: data.message.trim(),
                }).save();

                await ChatRoomModel.findByIdAndUpdate(room._id, {
                    lastMessage: data.message.trim(),
                });
                io.to(room._id.toString()).emit("chat:message", {
                    _id: chatMessage._id,
                    roomId: chatMessage.roomId,
                    sender: chatMessage.sender,
                    senderType: chatMessage.senderType,
                    message: chatMessage.message,
                    isRead: chatMessage.isRead,
                    createdAt: (chatMessage as any).createdAt,
                });
            } catch (error) {
                console.error("[Chat] chat:message error:", error);
                socket.emit("chat:error", { message: "Failed to send message" });
            }
        });

        socket.on("chat:typing", (data: { roomId: string; isTyping: boolean }) => {
            if (!data.roomId) return;

            socket.to(data.roomId).emit("chat:typing", {
                userId: user?._id,
                senderType: user?.role === "admin" ? "admin" : "customer",
                isTyping: data.isTyping,
            });
        });

        socket.on("chat:read", async (data: { roomId: string }) => {
            try {
                const isAdmin = user?.role === "admin";
                if (!data.roomId || (!user?._id && !isAdmin)) return;

                const senderType = isAdmin ? "customer" : "admin";

                await ChatMessageModel.updateMany(
                    { roomId: data.roomId, senderType, isRead: false } as any,
                    { isRead: true }
                );

                socket.to(data.roomId).emit("chat:read", {
                    roomId: data.roomId,
                    readBy: isAdmin ? "admin" : user._id,
                });
            } catch (error) {
                console.error("[Chat] chat:read error:", error);
                socket.emit("chat:error", { message: "Failed to mark messages as read" });
            }
        });

        socket.on("chat:close", async (data: { roomId: string }) => {
            try {
                if (!data.roomId) return;
                const room = await ChatRoomModel.findById(data.roomId);
                if (!room) return;

                const isAdmin = user?.role === "admin";
                if (!isAdmin && room.customer.toString() !== user?._id.toString()) {
                    return;
                }

                room.status = "closed";
                await room.save();

                io.to(room._id.toString()).emit("chat:closed", { roomId: room._id });
            } catch (error) {
                console.error("[Chat] chat:close error:", error);
            }
        });

        socket.on("chat:open", async (data: { roomId: string }) => {
            try {
                if (!data.roomId) return;
                const room = await ChatRoomModel.findById(data.roomId);
                if (!room) return;

                const isAdmin = user?.role === "admin";
                if (!isAdmin) return;

                room.status = "open";
                await room.save();

                io.to(room._id.toString()).emit("chat:opened", { roomId: room._id });
            } catch (error) {
                console.error("[Chat] chat:open error:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`[Chat] Socket disconnected: ${socket.id}`);
        });
    });
};
