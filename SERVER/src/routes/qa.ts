import { askQuestion, answerQuestion, deleteQuestion, getQuestionsByProductId, getAllQuestions, helpFulCount } from "../controllers";
import { Router } from "express";
import { userJWT, adminJWT } from "../helpers";
const router = Router();

router.post("/ask-question", userJWT, askQuestion);
router.get("/get-questions-by-product-id/:productId", userJWT, getQuestionsByProductId);
router.put("/helpful-count/:questionId", userJWT, helpFulCount)

router.post("/answer-question", answerQuestion);

router.get("/get-all-questions", adminJWT, getAllQuestions);
router.delete("/delete-question/:questionId", adminJWT, deleteQuestion);

export { router };