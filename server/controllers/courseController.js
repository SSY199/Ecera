import courseModel from "../models/course.model.js";

export const getCourses = async (req, res) => {
  try {
    const courses = await courseModel.find().populate('instructor', 'name email');
    res.status(200).json({
      message: 'Courses retrieved successfully',
      courses
    });
  } catch (error) {
    console.error('Get Courses Error:', error);
    res.status(500).json({ message: 'Server error while retrieving courses' });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await courseModel.findById(req.params.id).populate('instructor', 'name email');
    if (course) {
      res.status(200).json({
        message: 'Course retrieved successfully',
        course
      });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.error('Get Course By ID Error:', error);
    res.status(500).json({ message: 'Server error while retrieving course' });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, price, thumbnail } = req.body;

    const course = new courseModel({
      title,
      description,
      price,
      thumbnail,
      instructor: req.user._id
    });

    const createdCourse = await course.save();
    res.status(201).json({
      message: 'Course created successfully',
      course: createdCourse
    });
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Server error while creating course' });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await courseModel.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Delete Course Error:', error);
    res.status(500).json({ message: 'Server error while deleting course' });
  }
};


