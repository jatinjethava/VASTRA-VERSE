import { Router } from "express";
import { router as userRouter } from "./user";
import { router as categoryRouter } from "./category";
import { router as adminRouter } from "./admin";
import { router as ProductRouter } from "./product";
import { router as cartRouter } from "./cart";
import { router as wishlistRouter } from "./wishlist";
import { router as orderRouter } from "./order";
import { router as paymentRouter } from "./payment";
import { router as blogRouter } from "./blog";
import { router as notificationRouter } from "./notification";
import { router as reviewRouter } from "./review";
import { router as returnRouter } from "./return";
import { router as qaRouter } from "./qa";
import { router as addressRouter } from "./address";
import { router as faqsRouter } from "./faqs";
import { router as contactRouter } from "./contact";
import { router as couponRouter } from "./coupon";
import { router as salesReportRouter } from "./sales_report";
import { router as revenueRouter } from "./revenue_report";
import { router as analysisRouter } from "./analysis";
import { router as marketingRouter } from "./marketing";
import { router as chatRouter } from "./chat";
import { router as walletRouter } from "./wallet";

const router = Router({
    strict: true
});

router.use(adminRouter)
router.use(userRouter);
router.use(categoryRouter);
router.use(ProductRouter);
router.use(cartRouter);
router.use(wishlistRouter);
router.use(orderRouter);
router.use(paymentRouter);
router.use(blogRouter);
router.use(notificationRouter);
router.use(reviewRouter);
router.use(returnRouter);
router.use(qaRouter);
router.use(addressRouter);
router.use(faqsRouter);
router.use(contactRouter);
router.use(couponRouter);
router.use(salesReportRouter);
router.use(revenueRouter);
router.use(analysisRouter);
router.use(marketingRouter);
router.use(chatRouter);
router.use(walletRouter);

export { router };
