import { createContact, getContact, updateContact, deleteContact } from "../controllers";
import { Router } from "express";
import { adminJWT, userJWT } from "../helpers";

const router = Router();

router.post("/createContact", userJWT, createContact);

router.put("/updateContact/:id", adminJWT, updateContact);
router.put("/deleteContact/:id", adminJWT, deleteContact);
router.get("/getAllContacts", adminJWT, getContact);

export { router };