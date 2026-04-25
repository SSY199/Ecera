import express from 'express';
import { processPayment, getPaymentHistory } from '../controllers/paymentController.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/process', protect, processPayment);
router.get('/history', protect, getPaymentHistory);

export default router;