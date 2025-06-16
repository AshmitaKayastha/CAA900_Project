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
      enum: ["student", "instructor", "admin"], // optional for safety
      required: true
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    },
    collection: "users" // ensure it maps to the existing 'users' collection
  }
);

// Register model with exact collection name: 'users'
module.exports = mongoose.model("users", UserSchema);
