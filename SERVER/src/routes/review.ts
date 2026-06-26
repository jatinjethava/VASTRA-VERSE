import { createReview, deleteReview, getAllReviewById, getAllReview, getAllReviewsByAdmin, helpful, Like, matchLike, reportReview, updateReview, verifyReview, getMyReviews, adminReply } from "../controllers/review";
import { Router } from "express";
import { adminJWT, userJWT } from "../helpers";
import upload from "../services/multer";

const router = Router();

router.post("/createReview", userJWT, upload.array("images"), createReview);
router.put("/updateReview/:id", userJWT, upload.array("images"), updateReview);
router.put("/reportReview/:id", userJWT, reportReview);
router.put("/like/:id", userJWT, Like);
router.put("/helpful/:id", userJWT, helpful);
router.get("/matchLike/:id", userJWT, matchLike);
router.get("/myReviews", userJWT, getMyReviews);

router.get("/getAllReview/:id", getAllReviewById);
router.get("/getAllReview", getAllReview);

router.get("/getAllReviewsByAdmin", adminJWT, getAllReviewsByAdmin);
router.put("/verifyReview/:id", adminJWT, verifyReview);
router.put("/deleteReview/:id", adminJWT, deleteReview);
router.put("/adminReply/:id", adminJWT, adminReply);

export { router };