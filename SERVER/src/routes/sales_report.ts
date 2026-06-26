import { getSales, salesByDay, salesByMonth, salesByYear, salesByCategory, salesByProduct, salesByCustomer, Export } from "../controllers";
import { adminJWT } from "../helpers";
import { Router } from "express";

const router = Router();

router.get("/sales-report", adminJWT, getSales);
router.get("/sales/day", adminJWT, salesByDay);
router.get("/sales/month", adminJWT, salesByMonth);
router.get("/sales/year", adminJWT, salesByYear);
router.get("/sales/category", adminJWT, salesByCategory);
router.get("/sales/product", adminJWT, salesByProduct);
router.get("/sales/customer", adminJWT, salesByCustomer);
router.get("/sales/export", adminJWT, Export);

export { router };