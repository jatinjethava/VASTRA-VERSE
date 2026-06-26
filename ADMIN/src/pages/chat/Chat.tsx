import { useEffect, useState, useRef } from "react";
import { getChatRoomsAPI, getAdminChatMessagesAPI, closeChatRoomAPI } from "../../Api/chatApi";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Send, CheckCheck, User as UserIcon, Lock, Search } from "lucide-react";

interface ChatRoom {
    _id: string;
    customer: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    status: "open" | "closed";
    lastMessage: string;
    updatedAt: string;
}

interface ChatMessage {
    _id: string;
    roomId: string;
    sender: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    } | string;
    senderType: "customer" | "admin";
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const Chat = () => {
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState<Socket | null>(null);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await getChatRoomsAPI(1, 100);
            setRooms(res.data.rooms || []);
        } catch (error) {
            toast.error("Failed to load chat rooms");
        } finally {
            setLoadingRooms(false);
        }
    };

    useEffect(() => {
        const tokenStr = localStorage.getItem("adminToken");
        if (!tokenStr) return;
        const token = JSON.parse(tokenStr);

        const newSocket = io("http://localhost:8200", {
            auth: { token }
        });

        newSocket.on("connect", () => {
            console.log("Socket connected:", newSocket.id);
        });

        newSocket.on("chat:error", (data) => {
            toast.error(data.message || "Chat error");
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewRoom = (data: any) => {
            fetchRooms();
        };

        const handleMessage = (data: ChatMessage) => {
            if (selectedRoom && data.roomId === selectedRoom._id) {
                setMessages((prev) => [...prev, data]);
                socket.emit("chat:read", { roomId: selectedRoom._id });
            }
            setRooms(prev => prev.map(room =>
                room._id === data.roomId ? { ...room, lastMessage: data.message, updatedAt: new Date().toISOString() } : room
            ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
        };

        const handleReadReceipt = (data: { roomId: string, readBy: string }) => {
            if (selectedRoom && data.roomId === selectedRoom._id && data.readBy !== "admin") {
                setMessages(prev => prev.map(msg =>
                    msg.senderType === "admin" ? { ...msg, isRead: true } : msg
                ));
            }
        };

        const handleRoomStatusChange = (data: { roomId: string, status: "open" | "closed" }) => {
            setRooms(prev => prev.map(r => r._id === data.roomId ? { ...r, status: data.status } : r));
            setSelectedRoom(prev => prev && prev._id === data.roomId ? { ...prev, status: data.status } : prev);
        };

        socket.on("chat:new-room", handleNewRoom);
        socket.on("chat:message", handleMessage);
        socket.on("chat:read", handleReadReceipt);
        socket.on("chat:closed", (data) => handleRoomStatusChange({ roomId: data.roomId, status: "closed" }));
        socket.on("chat:opened", (data) => handleRoomStatusChange({ roomId: data.roomId, status: "open" }));

        return () => {
            socket.off("chat:new-room", handleNewRoom);
            socket.off("chat:message", handleMessage);
            socket.off("chat:read", handleReadReceipt);
            socket.off("chat:closed");
            socket.off("chat:opened");
        };
    }, [socket, selectedRoom]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    const handleSelectRoom = async (room: ChatRoom) => {
        setSelectedRoom(room);
        setLoadingMessages(true);
        try {
            const res = await getAdminChatMessagesAPI(room._id, 1, 100);
            setMessages(res.data.messages || []);

            if (socket) {
                socket.emit("chat:admin-join", { roomId: room._id });
                socket.emit("chat:read", { roomId: room._id });
            }
        } catch (error) {
            toast.error("Failed to load messages");
        } finally {
            setLoadingMessages(false);
        }
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || !selectedRoom || !socket) return;

        socket.emit("chat:message", {
            roomId: selectedRoom._id,
            message: inputValue.trim()
        });

        setInputValue("");
    };

    const handleCloseRoom = async () => {
        if (!selectedRoom || !socket) return;
        try {
            socket.emit("chat:close", { roomId: selectedRoom._id });
            toast.success("Chat room closed");
        } catch (error) {
            toast.error("Failed to close room");
        }
    };

    const handleOpenRoom = async () => {
        if (!selectedRoom || !socket) return;
        try {
            socket.emit("chat:open", { roomId: selectedRoom._id });
            toast.success("Chat room opened");
        } catch (error) {
            toast.error("Failed to open room");
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
                <div className="p-4 border-b border-gray-200 bg-white">
                    <h2 className="text-lg font-semibold text-gray-800">Chat Rooms</h2>
                    <div className="mt-3 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {loadingRooms ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-sm">Loading rooms...</span>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <span className="text-gray-400 text-sm">No chat rooms</span>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <div
                                key={room._id}
                                onClick={() => handleSelectRoom(room)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${selectedRoom?._id === room._id ? "bg-gray-100 border-l-4 border-l-gray-800" : ""}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-semibold text-gray-800 text-sm">{room.customer?.name || "Unknown User"}</h3>
                                    <span className="text-xs text-gray-400">
                                        {new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate pr-4">{room.lastMessage || "No messages yet"}</p>
                                    {room.status === "closed" && (
                                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">Closed</span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
                {selectedRoom ? (
                    <>
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-gray-800">{selectedRoom.customer?.name}</h2>
                                    <p className="text-xs text-gray-500">{selectedRoom.customer?.email}</p>
                                </div>
                            </div>
                            {selectedRoom.status === "open" ? (
                                <button
                                    onClick={handleCloseRoom}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Lock size={16} /> Close Chat
                                </button>
                            ) : (
                                <button
                                    onClick={handleOpenRoom}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                >
                                    <Lock size={16} /> Open Chat
                                </button>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                            {loadingMessages ? (
                                <div className="flex items-center justify-center h-full">
                                    <span className="text-gray-400 text-sm">Loading messages...</span>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <MessageSquare size={48} className="mb-2 text-gray-300" />
                                    <p className="text-sm">No messages yet. Send a message to start!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    const isAdmin = msg.senderType === "admin";
                                    return (
                                        <div key={msg._id || idx} className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}>
                                            <div className={`max-w-[70%] ${isAdmin ? "bg-gray-800 text-white rounded-2xl rounded-tr-sm" : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm"} px-4 py-2.5 shadow-sm relative group`}>
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <div className={`flex items-center gap-1 mt-1 text-[10px] ${isAdmin ? "text-gray-300 justify-end" : "text-gray-400"}`}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    {isAdmin && (
                                                        <CheckCheck size={14} className={msg.isRead ? "text-blue-400" : "text-gray-400"} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-200 bg-white shrink-0">
                            {selectedRoom.status === "open" ? (
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-2.5 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-gray-300 outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim()}
                                        className="p-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-xl disabled:bg-gray-300 transition-colors cursor-pointer"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center p-3 bg-gray-100 rounded-lg text-sm text-gray-500 flex justify-center items-center gap-2">
                                    <Lock size={16} /> This chat room has been closed.
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageSquare size={64} className="mb-4 text-gray-200" />
                        <h3 className="text-lg font-medium text-gray-600">Select a Chat</h3>
                        <p className="text-sm">Choose a customer from the left to start messaging</p>
                    </div>
                )}
            </div>
        </div>
    );
};
import { MessageSquare } from "lucide-react";
