import { createCoupon, userCoupon, updateCoupon, deleteCoupon, filterCoupons, toggleActive } from "../controllers/coupon";
import { Router } from "express";
import { adminJWT } from "../helpers";
const router = Router();

router.post("/coupon/create", adminJWT, createCoupon);
router.put("/coupon/update/:id", adminJWT, updateCoupon);
router.put("/coupon/delete/:id", adminJWT, deleteCoupon);
router.put("/coupon/toggle/:id", adminJWT, toggleActive);
router.get("/coupon/filter", filterCoupons);
router.get("/user-coupon", userCoupon);

export { router };