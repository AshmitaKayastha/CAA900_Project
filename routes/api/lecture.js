const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const coursemodel = require("../../models/Course.js");
const lecturemodel = require("../../models/Lecture.js");

// =========================
// GET: Fetch Lectures by Course ID (Sorted by Created Date)
// =========================
router.get("/lectures", async (req, res) => {
  try {
    const courseId = req.query.course;
    const lectures = await lecturemodel
      .find({ course: courseId })
      .sort({ createdAt: 1 })
      .populate({ path: "course", model: "Course", select: "courseDescription" });

    res.json(lectures);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch lectures",
      details: err.message,
    });
  }
});

// =========================
// GET: Fetch Single Lecture by ID
// =========================
router.get("/lectures/:id", async (req, res) => {
  try {
    const lecture = await lecturemodel.findById(req.params.id);
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found." });
    }
    res.json(lecture);
  } catch (err) {
    res.status(500).json({ error: "Error fetching lecture", details: err.message });
  }
});

// =========================
// POST: Upload Local Video File
// =========================
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
    const uploadsDir = path.join(__dirname, "../../uploads");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const cleanFileName = uploadedFile.name.replace(/\s+/g, "_");
    const savePath = path.join(uploadsDir, cleanFileName);
    await uploadedFile.mv(savePath);

    const newLecture = new lecturemodel({
      course: foundCourse._id,
      title,
      videoLink: "/uploads/" + cleanFileName,
    });

    const savedLecture = await newLecture.save();
    res.status(200).json(savedLecture);
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// =========================
// POST: Upload YouTube Video Link
// =========================
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

    // Extract YouTube video ID
    const videoIdMatch = videoLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return res.status(400).json({
        error: "Invalid YouTube link. Make sure it looks like https://www.youtube.com/watch?v=VIDEO_ID"
      });
    }

    const newLecture = new lecturemodel({
      course: foundCourse._id,
      title,
      videoLink: videoId,
    });

    const saved = await newLecture.save();
    res.status(200).json(saved);
  } catch (err) {
    console.error("YouTube upload failed:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
});

// =========================
// DELETE: Remove broken /assets/ lecture entries
// =========================
router.delete("/lectures/cleanup-broken", async (req, res) => {
  try {
    const result = await lecturemodel.deleteMany({ videoLink: /\/assets\// });
    res.json({ message: "Broken lectures deleted", deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: "Cleanup failed", details: err.message });
  }
});

module.exports = router;
