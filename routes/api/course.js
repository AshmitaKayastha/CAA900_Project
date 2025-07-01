const express = require("express");
const router = express.Router();

const coursemodel = require("../../models/Course");
const usermodel = require("../../models/User");
const catmodel = require("../../models/Category");

// @route   POST /api/course/add
// @desc    Add a new course
router.post("/add", async (req, res) => {
  try {
    const { courseName, courseDescription, category, instructor } = req.body;

    if (!courseName || !courseDescription || !category || !instructor) {
      return res.status(400).json("Missing course data.");
    }

    const categoryDoc = await catmodel.findOne({ categoryName: category });
    if (!categoryDoc) return res.status(400).json("Invalid category");

    const newCourse = new coursemodel({
      courseName,
      courseDescription,
      instructor,
      category: categoryDoc._id
    });

    const savedCourse = await newCourse.save();
    return res.status(200).json(savedCourse);
  } catch (err) {
    console.error("Add course error:", err);
    return res.status(500).json({ error: "Failed to add course", details: err.message });
  }
});

// ✅ NEW: GET /api/course (used by dashboard)
router.get("/", async (req, res) => {
  try {
    const courses = await coursemodel
      .find()
      .populate("category", "categoryName")
      .populate("instructor", "first_name last_name email role");

    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ✅ Alias: GET /api/course/courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await coursemodel
      .find()
      .populate("category", "categoryName")
      .populate("instructor", "first_name last_name email role");

    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ✅ GET /api/course/all (no populate)
router.get("/all", async (req, res) => {
  try {
    const courses = await coursemodel.find({});
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch courses", details: err.message });
  }
});

// ✅ GET /api/course/course?id=...
router.get("/course", async (req, res) => {
  try {
    const course = await coursemodel.findById(req.query.id);
    if (!course) return res.status(404).json("Course not found");
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err.message });
  }
});

// ✅ GET /api/course/:id (REST-style with populated data)
router.get("/:id", async (req, res) => {
  try {
    const course = await coursemodel
      .findById(req.params.id)
      .populate("category", "categoryName")
      .populate("instructor", "first_name last_name email role");

    if (!course) return res.status(404).json("Course not found");
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ error: "Fetch by ID failed", details: err.message });
  }
});

// ✅ GET /api/course/instructor/:id
router.get("/instructor/:id", async (req, res) => {
  try {
    const courses = await coursemodel.find({ instructor: req.params.id });
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Fetch by instructor failed", details: err.message });
  }
});

// ✅ PUT /api/course/:id (update course)
router.put("/:id", async (req, res) => {
  try {
    const updated = await coursemodel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json("Course not found");
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Update failed", details: err.message });
  }
});

// ✅ DELETE /api/course/:id (delete course)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await coursemodel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json("Course not found");
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

module.exports = router;
