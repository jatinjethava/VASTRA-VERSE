import { getChatRooms, getChatMessages, closeChatRoom, getMyRoom, getUnreadCount } from "../controllers";
import { Router } from "express";
import { adminJWT, userJWT } from "../helpers";

const router = Router();

router.get("/chat/rooms", adminJWT, getChatRooms);
router.put("/chat/rooms/:roomId/close", adminJWT, closeChatRoom);
router.get("/admin/chat/rooms/:roomId/messages", adminJWT, getChatMessages);
router.get("/admin/chat/rooms/:roomId/unread-count", adminJWT, getUnreadCount);

router.get("/chat/my-room", userJWT, getMyRoom);
router.get("/chat/rooms/:roomId/messages", userJWT, getChatMessages);
router.get("/chat/rooms/:roomId/unread-count", userJWT, getUnreadCount);

export { router };
