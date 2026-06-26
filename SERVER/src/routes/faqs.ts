import { createFaqs, deleteFaqs, getAllFaqs, getFaqs, getUserFaqs, toggleActiveFaqs, updateFaqs } from "../controllers";
import { Router } from "express";
import { adminJWT } from "../helpers";

const router = Router();

router.post("/createFaqs", adminJWT, createFaqs);
router.put("/updateFaqs/:id", adminJWT, updateFaqs);
router.delete("/deleteFaqs/:id", adminJWT, deleteFaqs);
router.put("/toggleActiveFaqs/:id", adminJWT, toggleActiveFaqs);
router.get("/getFaqs/:id", adminJWT, getFaqs);
router.get("/getAllFaqs", adminJWT, getAllFaqs);

router.get("/getUserFaqs", getUserFaqs);

export { router };