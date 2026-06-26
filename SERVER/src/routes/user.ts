import { Router } from "express";
import { registerUser, verifyUser, resedOtp, loginUser, googleLogin, changePassword, getUser, getAllUsers, blockUser, updateUser, RecentlyViewed, getRecentlyViewed, getLoginActivity, getAllSessions, logout, logoutOtherDevices, revokeToken, returningCustomers, customerGrowth, subscribeMail } from "../controllers";
import { adminJWT, userJWT } from "../helpers";
import upload from "../services/multer";
const userRoutes = Router();

userRoutes.post("/register", registerUser);
userRoutes.post("/verify", verifyUser);
userRoutes.post("/resend-otp", resedOtp);
userRoutes.post("/login", loginUser);
userRoutes.post("/google-login", googleLogin);
userRoutes.put("/change-password", userJWT, changePassword);
userRoutes.get("/get-user", userJWT, getUser);
userRoutes.put("/update-user", userJWT, upload.single("profileImage"), updateUser);
userRoutes.post("/recently-viewed/:id", userJWT, RecentlyViewed);
userRoutes.get("/recently-viewed", userJWT, getRecentlyViewed);
userRoutes.get("/get-login-activity", userJWT, getLoginActivity);
userRoutes.get("/get-all-sessions", userJWT, getAllSessions);
userRoutes.post("/logout-other-devices", userJWT, logoutOtherDevices);
userRoutes.delete("/revoke-token/:tokenId", userJWT, revokeToken);
userRoutes.post("/logout", userJWT, logout);
userRoutes.post("/subscribe-mail", userJWT, subscribeMail);

userRoutes.get("/get-all-users", adminJWT, getAllUsers);
userRoutes.put("/block-user/:id", adminJWT, blockUser);
userRoutes.get("/returning-customers", adminJWT, returningCustomers)
userRoutes.get("/customer-growth", adminJWT, customerGrowth)

export { userRoutes as router };