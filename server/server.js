import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'LMS Backend Server is running normally.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});