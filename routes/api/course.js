const express = require("express");
const router = express.Router();

const coursemodel = require("../../models/Course");
const usermodel = require("../../models/User");
const catmodel = require("../../models/Category");


// ==============================================
// ✅ Add a new course
// ==============================================
router.post("/add", async (req, res) => {
  try {
    if (!req.body || !req.body.category || !req.body.instructor) {
      return res.status(400).json("Missing course data.");
    }

    // Resolve category ID from category name
    const category = await catmodel.findOne({ categoryName: req.body.category });
    if (category) {
      req.body.category = category._id;
    }

    const newCourse = new coursemodel(req.body);
    const savedCourse = await newCourse.save();
    return res.status(200).json(savedCourse);
  } catch (err) {
    return res.status(500).json({ error: "Failed to add course", details: err });
  }
});

// ==============================================
// ✅ Get all courses (for admin/instructor dashboard)
// ==============================================
router.get("/courses", (req, res, next) => {
  coursemodel
    .find()
    .populate("category", "categoryName")
    .populate("instructor", "first_name last_name email role")
    .exec((err, results) => {
      if (err) return next(err);
      res.json(results);
    });
});

// ==============================================
// ✅ Get all courses (for student/public view)
// ==============================================
router.get("/all", async (req, res) => {
  try {
    const courses = await coursemodel.find({});
    return res.status(200).json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Unable to fetch courses", details: err });
  }
});

// ==============================================
// ✅ Get single course by ID
// ==============================================
router.get("/course", async (req, res) => {
  try {
    const course = await coursemodel.findById(req.query.id);
    if (!course) return res.status(404).json("Course not found");
    return res.json(course);
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", details: err });
  }
});

// ==============================================
// ✅ Get courses by instructor ID
// ==============================================
router.get("/coursebyinstructor", async (req, res) => {
  try {
    const courses = await coursemodel.find({ instructor: req.query.id });
    return res.json(courses);
  } catch (err) {
    return res.status(500).json({ error: "Fetch by instructor failed", details: err });
  }
});

// ==============================================
// ✅ Update a course
// ==============================================
router.put("/course", async (req, res) => {
  try {
    const updated = await coursemodel.findOneAndUpdate(
      { _id: req.query.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json("Course not found");
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ error: "Update failed", details: err });
  }
});

// ==============================================
// ✅ Delete a course
// ==============================================
router.delete("/course", async (req, res) => {
  try {
    const deleted = await coursemodel.findOneAndDelete({ _id: req.query.id });
    if (!deleted) return res.status(404).json("Course not found");
    return res.json(deleted);
  } catch (err) {
    return res.status(500).json({ error: "Delete failed", details: err });
  }
});

module.exports = router;
