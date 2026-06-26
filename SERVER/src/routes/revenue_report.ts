import { getRevenueOverview, getRevenueCharts, getRevenueByRegion, getRevenueByPaymentMethod, exportRevenue } from "../controllers";
import { adminJWT } from "../helpers";
import { Router } from "express";

const router = Router();

router.get("/revenue/overview", adminJWT, getRevenueOverview);
router.get("/revenue/charts", adminJWT, getRevenueCharts);
router.get("/revenue/region", adminJWT, getRevenueByRegion);
router.get("/revenue/payment-method", adminJWT, getRevenueByPaymentMethod);
router.get("/revenue/export", adminJWT, exportRevenue);

export { router };
