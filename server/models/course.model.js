import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: { 
      type: String, 
      required: true 
    },
    instructor: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    thumbnail: { 
      type: String, 
      default: '' 
    },
    isPublished: {
      type: Boolean,
      default: false
    },
    studentsEnrolled: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    }]
  },
  { timestamps: true }
);

export default mongoose.model('Course', courseSchema);