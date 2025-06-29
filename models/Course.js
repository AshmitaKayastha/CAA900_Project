const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema(
  {
    courseName: {
      type: String,
      required: true
    },
    courseDescription: {
      type: String,
      required: true
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

// ✅ FIXED: Model name should match ref: "Course"
module.exports = mongoose.model("Course", CourseSchema);
