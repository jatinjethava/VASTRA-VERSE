import { addReason, cancelOrder, checkStatus, createOrder, fetchAllOrders, getMyOrders, updateExpectedDeliveryDate, updateOrder, updatePaymentStatus, downloadInvoice } from "../controllers/order";
import { Router } from "express";
import { adminJWT, userJWT } from "../helpers";

const router = Router();


router.post("/create-order", userJWT, createOrder);
router.get("/orders", userJWT, getMyOrders);
router.put("/cancel-order/:orderId", userJWT, cancelOrder);
router.get("/download-invoice/:orderId", userJWT, downloadInvoice);
router.get("/order-status/:orderNumber", userJWT, checkStatus);

router.get("/admin/orders", adminJWT, fetchAllOrders);
router.put("/update-order/:orderId", adminJWT, updateOrder);
router.put("/update-payment-status/:orderId", adminJWT, updatePaymentStatus);
router.post("/add-reason/:orderId", adminJWT, addReason);
router.get("/admin/download-invoice/:orderId", adminJWT, downloadInvoice);
router.put("/expected-delivery-date/:orderId", adminJWT, updateExpectedDeliveryDate);

export { router };