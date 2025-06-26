const express = require("express");
const router = express.Router();

const coursemodel = require("../../models/Course");
const usermodel = require("../../models/User");
const catmodel = require("../../models/Category");

// @route   POST /api/course/add
// @desc    Add a new course
// @access  Public or Protected based on your auth logic
router.post("/add", async (req, res) => {
  try {
    const { title, description, category, instructor } = req.body;
    if (!title || !description || !category || !instructor) {
      return res.status(400).json("Missing course data.");
    }

    // Convert category name to ObjectId
    const categoryDoc = await catmodel.findOne({ categoryName: category });
    if (!categoryDoc) return res.status(400).json("Invalid category");

    const newCourse = new coursemodel({
      ...req.body,
      category: categoryDoc._id
    });

    const savedCourse = await newCourse.save();
    return res.status(200).json(savedCourse);
  } catch (err) {
    console.error("Add course error:", err);
    return res.status(500).json({ error: "Failed to add course", details: err });
  }
});

// @route   GET /api/course/courses
// @desc    Get all courses (with populated category and instructor)
// @access  Public
router.get("/courses", (req, res) => {
  coursemodel
    .find()
    .populate("category", "categoryName")
    .populate("instructor", "first_name last_name email role")
    .exec((err, results) => {
      if (err) return res.status(500).json({ error: "Fetch failed", details: err });
      res.json(results);
    });
});

// @route   GET /api/course/all
// @desc    Get all raw courses (no populate)
// @access  Public
router.get("/all", async (req, res) => {
  try {
    const courses = await coursemodel.find({});
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch courses", details: err });
  }
});

// @route   GET /api/course/course?id=...
// @desc    Get course by ID (query param version)
// @access  Public
router.get("/course", async (req, res) => {
  try {
    const course = await coursemodel.findById(req.query.id);
    if (!course) return res.status(404).json("Course not found");
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err });
  }
});

// @route   GET /api/course/:id
// @desc    Get course by ID (RESTful version)
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const course = await coursemodel
      .findById(req.params.id)
      .populate("category", "categoryName")
      .populate("instructor", "first_name last_name email role");

    if (!course) return res.status(404).json("Course not found");
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ error: "Fetch by ID failed", details: err });
  }
});

// @route   GET /api/course/instructor/:id
// @desc    Get courses by instructor ID
// @access  Public
router.get("/instructor/:id", async (req, res) => {
  try {
    const courses = await coursemodel.find({ instructor: req.params.id });
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Fetch by instructor failed", details: err });
  }
});

// @route   PUT /api/course/:id
// @desc    Update course by ID
// @access  Public or Protected
router.put("/:id", async (req, res) => {
  try {
    const updated = await coursemodel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json("Course not found");
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Update failed", details: err });
  }
});

// @route   DELETE /api/course/:id
// @desc    Delete course by ID
// @access  Public or Protected
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await coursemodel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json("Course not found");
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err });
  }
});

module.exports = router;
