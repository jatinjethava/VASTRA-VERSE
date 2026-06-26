import { Router } from "express";
import { createReturn, getReturnOrders, getUserReturnOrders, updateReturnStatus } from "../controllers";
import upload from "../services/multer";
import { userJWT, adminJWT } from "../helpers";

const router = Router();

// User Routes
router.post("/create-return", userJWT, upload.array("images", 5), createReturn);
router.get("/my-returns", userJWT, getUserReturnOrders);

// Admin Routes
router.get("/all-returns", adminJWT, getReturnOrders);
router.put("/update-status/:id", adminJWT, updateReturnStatus);

export { router };