const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const enrollmodel = require("../../models/Enrollment");
const coursemodel = require("../../models/Course");
const usermodel = require("../../models/User");

// ✅ Get all enrollments
router.get("/", async (req, res) => {
  try {
    const enrollments = await enrollmodel
      .find()
      .populate("student", "first_name last_name email role")
      .populate("course", "courseName");
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ✅ Alias for all enrollments
router.get("/enrollments", async (req, res) => {
  try {
    const enrollments = await enrollmodel
      .find()
      .populate("student", "first_name last_name email role")
      .populate("course", "courseName");
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ✅ Get enrollments by student (query param)
router.get("/enrollmentbystudent", async (req, res) => {
  try {
    const enrollments = await enrollmodel
      .find({ student: req.query.id })
      .populate("course", "courseName courseDescription");
    res.status(200).json(enrollments);
  } catch (err) {
    res.status(500).json({ error: "Fetch by student ID failed", details: err.message });
  }
});

// ✅ Get enrollments by student (route param) — FIXED with safe populate
router.get("/enrollmentbystudentid/:id", async (req, res) => {
  try {
    const enrollments = await enrollmodel
      .find({ student: req.params.id })
      .populate({
        path: "course",
        select: "courseName courseDescription",
        strictPopulate: false // Prevent crash if ref is broken
      });

    // Filter out any enrollments with missing course refs
    const filtered = enrollments.filter((e) => e.course !== null);

    res.status(200).json(filtered);
  } catch (err) {
    console.error("Error fetching enrollments by student ID:", err);
    res.status(500).json({ error: "Fetch by student ID failed", details: err.message });
  }
});

// ✅ Check if a student is enrolled in a course
router.get("/checkenrollment", async (req, res) => {
  try {
    const { id, courseid } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(courseid)) {
      return res.status(400).json({ error: "Invalid student or course ID" });
    }

    const record = await enrollmodel.findOne({
      student: id,
      course: courseid
    });

    res.status(200).json(record);
  } catch (err) {
    res.status(500).json({ error: "Enrollment check failed", details: err.message });
  }
});

// ✅ Enroll using email and course name
router.post("/enroll/add", async (req, res) => {
  try {
    const { student, course } = req.body;
    if (!student || !course) return res.status(400).json("Missing required fields");

    const user = await usermodel.findOne({ email: student });
    const courseDoc = await coursemodel.findOne({ courseName: course });

    if (!user || !courseDoc) return res.status(400).json("Invalid student or course");

    const newEnrollment = new enrollmodel({
      student: user._id,
      course: courseDoc._id
    });

    const saved = await newEnrollment.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Enrollment failed", details: err.message });
  }
});

// ✅ Enroll using IDs directly
router.post("/enrollbystudent/add", async (req, res) => {
  try {
    const { student, course } = req.body;
    if (!student || !course) return res.status(400).json("Missing student or course ID");

    const newEnrollment = new enrollmodel({ student, course });
    const saved = await newEnrollment.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Enrollment failed", details: err.message });
  }
});

// ✅ Delete enrollment by ID
router.delete("/enrollment", async (req, res) => {
  try {
    const deleted = await enrollmodel.findOneAndDelete({ _id: req.query.id });
    if (!deleted) return res.status(404).json("Enrollment not found");
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

module.exports = router;
