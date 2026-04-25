import express from 'express';
import { createCoupon, deleteCoupon, verifyCoupon } from '../controllers/couponController.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', protect, adminOnly, createCoupon);
router.get('/verify/:code', protect, verifyCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

export default router;