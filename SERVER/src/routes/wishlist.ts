import { Router } from "express";
import { userJWT } from "../helpers";
import { addToWishlist, getWishlistForCheck, getWishlistShowProducts, removeFromWishlist } from "../controllers";

const router = Router();

router.post("/wishlist/add", userJWT, addToWishlist);
router.delete("/wishlist/remove", userJWT, removeFromWishlist);
router.get("/wishlist/get", userJWT, getWishlistForCheck);
router.get("/wishlist/get-products", userJWT, getWishlistShowProducts);

export { router };