import { Router } from "express";
import { createPaymentOrder, verifyPayment, createRefund, getPaymentById, failPayment } from "../controllers";
import { adminJWT, userJWT } from "../helpers";

const router = Router();

router.post("/create-payment-order", userJWT, createPaymentOrder);
router.post("/verify-payment", userJWT, verifyPayment);
router.get("/get-payment-by-id", userJWT, getPaymentById);
router.post("/fail-payment", userJWT, failPayment);

router.post("/create-refund", adminJWT, createRefund);

export { router };