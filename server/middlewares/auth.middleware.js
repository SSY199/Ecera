import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    // Check token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // If no token
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Get user (without password)
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error('Auth Error:', error);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Admin access only' });
  }
};