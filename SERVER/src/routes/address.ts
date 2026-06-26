import { createAddress, deleteAddress, getDefaultAddress, getAllAddress, updateAddress, setDefaultAddress } from "../controllers";
import { userJWT } from "../helpers";
import { Router } from "express";

const router = Router();

router.post("/create-address", userJWT, createAddress);
router.put("/update-address/:id", userJWT, updateAddress);
router.put("/delete-address/:id", userJWT, deleteAddress);
router.put("/set-default-address/:id", userJWT, setDefaultAddress);
router.get("/get-default-address", userJWT, getDefaultAddress);
router.get("/get-all-address", userJWT, getAllAddress);

export { router };