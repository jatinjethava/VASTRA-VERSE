import { Router } from "express";
import { creditMoney, verifyCreditPayment, getWalletInfo, getWalletTransactions } from "../controllers";
import { userJWT } from "../helpers";

const router = Router();

router.post("/add-money-to-wallet", userJWT, creditMoney);
router.post("/verify-razorpay-signature", userJWT, verifyCreditPayment);
router.get("/get-wallet-info", userJWT, getWalletInfo);
router.get("/get-wallet-transactions", userJWT, getWalletTransactions);

export { router };
