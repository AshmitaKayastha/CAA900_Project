const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    first_name: {
      type: String,
      lowercase: true,
      required: true
    },
    last_name: {
      type: String,
      lowercase: true,
      required: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "users" // keep this to explicitly use 'users' collection
  }
);

// ✅ Correct model name
module.exports = mongoose.model("User", UserSchema);
