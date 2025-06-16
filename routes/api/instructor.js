// routes/api/instructor.js
const express = require('express');
const router = express.Router();
const Course = require('../../models/Course'); // Or whatever model you use

// @route   GET /api/instructor/courses/:id
// @desc    Get courses by instructor ID
// @access  Private
router.get('/courses/:id', (req, res) => {
  Course.find({ instructorId: req.params.id })
    .then(courses => res.json(courses))
    .catch(err => res.status(404).json({ nocourses: "No courses found" }));
});

module.exports = router;
