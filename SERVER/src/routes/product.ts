import { Router } from "express";
import { createProduct, deleteProduct, filterProducts, getProductByCategory, getProducts, getPublishedProducts, updateProduct, increaseStock, getProductsForUser, viewProduct } from "../controllers/product";
import { adminJWT, userJWT } from "../helpers";
import upload from "../services/multer";
const router = Router();

router.post("/product/create", adminJWT, upload.array("images", 5), createProduct);
router.put("/product/update/:id", adminJWT, upload.array("images", 5), updateProduct);
router.delete("/product/delete/:id", adminJWT, deleteProduct);
router.get("/product/get", adminJWT, getProducts);
router.put("/product/inc-stock/:id", adminJWT, increaseStock);

router.get("/product/get-published", getPublishedProducts);
router.get("/product/get/:id", userJWT, getProductByCategory);
router.get("/product/filter", userJWT, filterProducts);
router.get("/product/all", userJWT, getProductsForUser);
router.post("/product/viewed/:id", userJWT, viewProduct);

export { router }