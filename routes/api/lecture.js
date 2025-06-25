const express = require("express");
const router = express.Router(); // ✅ ADD THIS
const coursemodel = require("../../models/Course.js");
const lecturemodel = require("../../models/Lecture.js");
const mongoose = require("mongoose");
const path = require("path");
const fileUpload = require("express-fileupload");

/* ======================
   GET: Fetch Lectures
====================== */
router.get("/lectures", function (req, res) {
  lecturemodel
    .find({ course: req.query.id })
    .populate({ path: "course", model: "courses", select: "courseDescription" })
    .then((doc) => res.json(doc))
    .catch((err) => res.status(500).json(err));
});

/* ================================
   POST: Local File Video Upload
================================ */
router.post("/lectures/localupload", async (req, res) => {
  try {
    const { course, title } = req.body;
    if (!course || !title || !req.files || !req.files.file) {
      return res.status(400).json({ error: "Missing required fields or file." });
    }

    const foundCourse = await coursemodel.findById(course);
    if (!foundCourse) {
      return res.status(404).json({ error: "Course not found." });
    }

    const uploadedFile = req.files.file;
    const savePath = path.join(__dirname, "../../client/public/assets/", uploadedFile.name);
    await uploadedFile.mv(savePath);

    const newLecture = new lecturemodel({
      course: foundCourse._id,
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
router.post("/lectures/youtube", async (req, res) => {
  try {
    const { course, title, videoLink } = req.body;

    if (!course || !title || !videoLink) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const foundCourse = await coursemodel.findById(course);
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

module.exports = router; // ✅ Don't forget this!
