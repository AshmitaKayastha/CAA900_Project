const express = require("express");
const router = express.Router();
const coursemodel = require("../../models/Course.js");
const lecturemodel = require("../../models/Lecture.js");
const mongoose = require("mongoose");
const path = require("path");

// File upload (using express-fileupload)
const fileUpload = require("express-fileupload");

// If not already applied globally in server.js
// router.use(fileUpload());

/* ======================
   GET: Fetch Lectures
====================== */
router.get("/lectures", function (req, res) {
  lecturemodel
    .find({ course: req.query.id })
    .populate({ path: "course", model: "courses", select: "courseDescription" })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json(err));
});

/* ================================
   POST: Local File Video Upload
================================ */
router.post("/lectures/localupload", async function (req, res) {
  try {
    const { course, title } = req.body;
    if (!course || !title || !req.files) {
      return res.status(400).json({ error: "Missing required fields or file." });
    }

    // Find course by course name
    const foundCourse = await coursemodel.findOne({ courseName: course });
    if (!foundCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    const courseId = foundCourse._id;
    const uploadedFile = req.files.file;

    const savePath = path.join(__dirname, "../../client/public/assets/", uploadedFile.name);
    await uploadedFile.mv(savePath); // move file

    const newLecture = new lecturemodel({
      course: courseId,
      title,
      videoLink: "/assets/" + uploadedFile.name
    });

    const savedLecture = await newLecture.save();
    res.status(200).json(savedLecture);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

/* ================================
   POST: YouTube Video Upload
================================ */
router.post("/lectures/youtubeupload", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const { course, title, videoLink } = req.body;

    if (!course || !title || !videoLink) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Find course by course name
    const foundCourse = await coursemodel.findOne({ courseName: course });
    if (!foundCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    const newLecture = new lecturemodel({
      course: foundCourse._id,
      title,
      videoLink
    });

    const saved = await newLecture.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error("YouTube upload failed:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

module.exports = router;

