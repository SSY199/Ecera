import express from 'express';
import { getCourses, createCourse, getCourseById, deleteCourse } from '../controllers/courseController.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', getCourses);
router.post('/', protect, adminOnly, createCourse);

router.get('/:id', getCourseById);
router.delete('/:id', protect, adminOnly, deleteCourse);

export default router;