import { Router } from "express";
import { createBlog, deleteBlog, getAllBlogForUser, updateBlog, updateBlogStatus, getAllBlog, getUserBlog, viewBlog } from "../controllers/blog";
import upload from "../services/multer";
import { adminJWT, userJWT } from "../helpers";

const router = Router();

router.post("/create-blog", upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), adminJWT, createBlog);
router.put("/update-blog-status/:id", adminJWT, updateBlogStatus);
router.delete("/delete-blog/:id", adminJWT, deleteBlog);

router.post("/create-blog-by-user", upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), userJWT, createBlog);
router.get("/get-user-blog", userJWT, getUserBlog);
router.delete("/delete-user-blog/:id", userJWT, deleteBlog);
router.put("/view-blog/:id", userJWT, viewBlog);

router.put("/update-blog/:id", upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
]), updateBlog);

router.get("/get-all-blog", getAllBlogForUser);
router.get("/get-all-blog-for-admin", getAllBlog);

export { router };
