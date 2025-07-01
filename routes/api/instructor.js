const express = require('express');
const router = express.Router();
const Course = require('../../models/Course');

// @route   GET /api/instructor/courses/:id
// @desc    Get courses by instructor ID
// @access  Public or Private (depends on auth)
router.get('/courses/:id', async (req, res) => {
  const instructorId = req.params.id;

  try {
    if (!instructorId) {
      return res.status(400).json({ error: "Instructor ID is required." });
    }

    console.log("🔍 Looking for courses by instructor:", instructorId);

    const courses = await Course.find({ instructor: instructorId })
      .populate("category", "categoryName")
      .populate("instructor", "first_name last_name email");

    if (!courses || courses.length === 0) {
      return res.status(200).json([]); // ← Return empty array if no course found
    }

    console.log("✅ Courses found:", courses.length);
    res.status(200).json(courses);
  } catch (err) {
    console.error("🔥 Error fetching instructor courses:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

module.exports = router;
