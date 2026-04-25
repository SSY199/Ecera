import paymentModel from "../models/payment.model.js";
import courseModel from "../models/course.model.js";
import couponModel from "../models/coupon.model.js";

export const processPayment = async (req, res) => {
  try {
    const { courseId, couponCode } = req.body;
    const userId = req.user._id;

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.studentsEnrolled.includes(userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    let amountToPay = course.price;
    let finalAmount = amountToPay;
    let appliedCouponId = null;

    // Coupon logic
    if (couponCode) {
      const coupon = await couponModel.findOne({
        code: couponCode.toUpperCase(),
      });

      if (
        !coupon ||
        !coupon.isActive ||
        new Date() > new Date(coupon.expiryDate) ||
        coupon.usedCount >= coupon.usageLimit
      ) {
        return res.status(400).json({ message: "Invalid or expired coupon" });
      }

      const discount = (amountToPay * coupon.discountPercentage) / 100;
      finalAmount = amountToPay - discount;
      appliedCouponId = coupon._id;
    }

    // Mock payment
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const payment = await paymentModel.create({
      user: userId,
      course: courseId,
      amountPaid: finalAmount,
      transactionId,
      status: "success",
      couponApplied: appliedCouponId,
    });

    // Enroll only after success
    course.studentsEnrolled.push(userId);
    await course.save();

    // Update coupon usage AFTER success
    if (appliedCouponId) {
      await couponModel.findByIdAndUpdate(appliedCouponId, {
        $inc: { usedCount: 1 },
      });
    }

    res.status(201).json({
      success: true,
      message: "Payment successful and course enrolled",
      payment,
      transactionId,
    });

  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const payments = await paymentModel.find({ user: req.user._id }).populate('course', 'title price thumbnail').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      payments
    });
  }
  catch (error) {
    console.error("Get Payment History Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};