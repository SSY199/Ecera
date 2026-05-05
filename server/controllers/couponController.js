import Coupon from '../models/coupon.model.js';

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expiresAt, usageLimit } = req.body;

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code,
      discountPercentage,
      expiryDate: expiresAt,
      usageLimit
    });

    const createdCoupon = await coupon.save();
    res.status(201).json({
      message: 'Coupon created successfully',
      coupon: createdCoupon
    });
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ message: 'Server error while creating coupon' });
  }
};

export const verifyCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    if(!coupon.isActive){
      return res.status(400).json({ message: 'This coupon is no longer active' });
    }
    if(new Date() > new Date(coupon.expiryDate)){
      return res.status(400).json({ message: 'This coupon has expired' });
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    res.status(200).json({
      message: 'Coupon is valid',
      couponId: coupon._id,
      code: coupon.code,
      discountPercentage: coupon.discountPercentage
    });
  } catch (error) {
    console.error('Verify Coupon Error:', error);
    res.status(500).json({ message: 'Server error while verifying coupon' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      await coupon.remove();
      res.status(200).json({ message: 'Coupon deleted successfully' });
    }
    else {
      res.status(404).json({ message: 'Coupon not found' });
    }
  } catch (error) {
    console.error('Delete Coupon Error:', error);
    res.status(500).json({ message: 'Server error while deleting coupon' });
  }
};