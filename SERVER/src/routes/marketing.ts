import { createCampaign, updateCampaign, deleteCampaign, toggleCampaign, getCampaign, getAllCampaigns, getUserCampaigns, createFlashSales, updateFlashSales, deleteFlashSales, toggleFlashSales, getAllFlashSales, getForUserFlashSales, createBanner, updateBanner, deleteBanner, getBannerById, getAllBanners } from "../controllers";
import { Router } from "express";
import { adminJWT, userJWT } from "../helpers";
import upload from "../services/multer";
const router = Router();

router.post("/create-campaign", adminJWT, upload.array("image"), createCampaign);
router.put("/update-campaign/:id", adminJWT, upload.array("image"), updateCampaign);
router.put("/delete-campaign/:id", adminJWT, deleteCampaign);
router.put("/toggle-campaign/:id", adminJWT, toggleCampaign);
router.get("/get-campaign/:id", adminJWT, getCampaign);
router.get("/get-all-campaigns", adminJWT, getAllCampaigns);
router.get("/get-active-campaigns", getUserCampaigns);

// for flash sales
router.post("/create-flash-sales", adminJWT, upload.array("image"), createFlashSales);
router.put("/update-flash-sales/:id", adminJWT, upload.array("image"), updateFlashSales);
router.put("/delete-flash-sales/:id", adminJWT, deleteFlashSales);
router.put("/toggle-flash-sales/:id", adminJWT, toggleFlashSales);
router.get("/get-all-flash-sales", adminJWT, getAllFlashSales);
router.get("/get-active-flash-sales", getForUserFlashSales);

// for banner
router.post("/create-banner", adminJWT, upload.fields([{ name: "bgImage", maxCount: 1 }]), createBanner);
router.put("/update-banner/:id", adminJWT, upload.fields([{ name: "bgImage", maxCount: 1 }]), updateBanner);
router.put("/delete-banner/:id", adminJWT, deleteBanner);
router.get("/get-all-banners-for-admin", adminJWT, getAllBanners);
router.get("/get-banner/:id", adminJWT, getBannerById);
router.get("/get-all-banners-for-user", getAllBanners);

export { router };