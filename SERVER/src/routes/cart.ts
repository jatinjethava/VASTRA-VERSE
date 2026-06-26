import { Router } from "express";
import { addToCart, decreaseQuantity, deleteCart, clearCart, getCart, increaseQuantity, updateCart, applyCuponCode, getSaveCart, moveCart, saveForLater } from "../controllers";
import { userJWT } from "../helpers";

const router = Router();

router.post("/add-to-cart", userJWT, addToCart);
router.put("/update-cart/:id", userJWT, updateCart);
router.delete("/delete-cart/:id", userJWT, deleteCart);
router.delete("/clear-cart", userJWT, clearCart);
router.get("/get-cart", userJWT, getCart);
router.put("/save-for-later/:id", userJWT, saveForLater);
router.get("/get-save-cart", userJWT, getSaveCart);
router.put("/move-cart/:id", userJWT, moveCart);
router.put("/increase-quantity/:id", userJWT, increaseQuantity);
router.put("/decrease-quantity/:id", userJWT, decreaseQuantity);
router.put("/apply-coupon-code", userJWT, applyCuponCode);

export { router };