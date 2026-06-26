import { Router } from "express";
import { adminLogin } from "../controllers/admin";
const adminRoute = Router();

adminRoute.post("/admin/login", adminLogin);

export { adminRoute as router };
