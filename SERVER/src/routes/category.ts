import { Router } from "express";
import { createCategory, deleteCategory, updateCategory, getAllCategory, getParentCategory, shopBySlug, getChildCategory, getChildCategoriesBySlug } from "../controllers";
import { adminJWT, userJWT } from "../helpers"
import upload from "../services/multer";

const categoryRouter = Router();

categoryRouter.post("/createCategory", adminJWT, upload.single("banner"), createCategory);
categoryRouter.put("/updateCategory/:id", adminJWT, upload.single("banner"), updateCategory);
categoryRouter.delete("/deleteCategory/:id", adminJWT, deleteCategory);
categoryRouter.get("/getAllCategory", adminJWT, getAllCategory);
categoryRouter.get("/getParentCategory", adminJWT, getParentCategory);

categoryRouter.get("/shopBySlug/:slug", shopBySlug);
categoryRouter.get("/getChildCategory/:id", getChildCategory);
categoryRouter.get("/getChildCategoriesBySlug/:slug", getChildCategoriesBySlug);

export { categoryRouter as router };
