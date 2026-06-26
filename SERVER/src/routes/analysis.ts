import { categoryAnalysis, conversionRate, mostWishlisted, productAnalysis, productViewAnalysis } from '../controllers';
import express from 'express';
import { adminJWT } from '../helpers';

const router = express.Router();

router.get('/product-analysis', adminJWT, productAnalysis);
router.get('/view-analysis', adminJWT, productViewAnalysis);
router.get('/wishlisted-analysis', adminJWT, mostWishlisted);
router.get('/conversion-rate', adminJWT, conversionRate);
router.get('/category-analysis', adminJWT, categoryAnalysis);

export { router };