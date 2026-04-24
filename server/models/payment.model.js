import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    amountPaid: {
      type: Number,
      required: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String, enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    couponApplied: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);