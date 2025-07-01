const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LectureSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "courses", // ✅ must match what you used in mongoose.model()
      required: true
    },
    title: {
      type: String,
      required: true
    },
    videoLink: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("lectures", LectureSchema); // ✅ also lowercase
