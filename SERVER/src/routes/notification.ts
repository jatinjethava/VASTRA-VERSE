import { Router } from "express";
import {
    getAdminNotifications,
    AllreadAdminNotifications,
    getUserNotifications,
    readUserNotifications,
    markAsRead,
    markAllAsReadAdmin,
    markAllAsReadUser
} from "../controllers/notification";
const router = Router();
import { userJWT, adminJWT } from "../helpers";

router.get("/get-admin-notifications", adminJWT, getAdminNotifications);
router.put("/read-all-admin-notifications", adminJWT, AllreadAdminNotifications);
router.put("/mark-all-as-read", adminJWT, markAllAsReadAdmin);

router.put("/mark-as-read/:id", markAsRead);

router.get("/get-user-notifications", userJWT, getUserNotifications);
router.put("/read-all-user-notifications", userJWT, readUserNotifications);
router.put("/mark-all-as-read", userJWT, markAllAsReadUser);

export { router };