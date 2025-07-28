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
    },
    courseImage: {
      type: String,
      default: "/uploads/elearners.jpg"
    }
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Course", CourseSchema);
