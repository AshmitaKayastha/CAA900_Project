let enrollmodel = require("../../models/Enrollment");
let coursemodel = require("../../models/Course");
let usermodel = require("../../models/User");
let express = require("express");
let router = express.Router();


// ✅ Get all enrollments

router.get("/enrollments", (req, res, next) => {
  enrollmodel
    .find()
    .populate({ path: "student", model: "users" })
    .populate({ path: "course", model: "courses", select: "courseName" })
    .exec((err, results) => {
      if (err) return next(err);
      res.json(results);
    });
});

// ✅ Get enrollments by student ID (via query)
router.get("/enrollmentbystudent", (req, res) => {
  enrollmodel
    .find({ student: req.query.id })
    .populate({ path: "course", model: "courses" })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json(err));
});

// ✅ ✅ NEW: Get enrollments by student ID (via route param)
router.get("/enrollmentbystudentid/:id", (req, res) => {
  enrollmodel
    .find({ student: req.params.id })
    .populate({ path: "course", model: "courses" })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json(err));
});

// ✅ Check if student is enrolled in a course


router.get("/checkenrollment", (req, res) => {
  enrollmodel
    .findOne({
      student: req.query.id,
      course: req.query.courseid
    })
    .populate({ path: "course", model: "courses", select: "courseName" })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json(err));
});

// ✅ Enroll student using courseName and email
router.post("/enroll/add", (req, res) => {
  if (!req.body) return res.status(400).send("request body is missing");

  usermodel.find({ email: req.body.student }, (error, users) => {
    if (!error && users && users.length > 0) {
      req.body.student = users[0]._id;
    }

    coursemodel.find({ courseName: req.body.course }, (error, courses) => {
      if (!error && courses && courses.length > 0) {
        req.body.course = courses[0]._id;
      }

      let model = new enrollmodel(req.body);
      model
        .save()
        .then(doc => {
          if (!doc) return res.status(500).send(doc);
          res.status(200).send(doc);
        })
        .catch(err => res.status(500).json(err));
    });
  });
});

// ✅ Enroll student directly using IDs
router.post("/enrollbystudent/add", (req, res) => {
  if (!req.body) return res.status(400).send("request body is missing");

  let model = new enrollmodel(req.body);
  model
    .save()
    .then(doc => {
      if (!doc) return res.status(500).send(doc);
      res.status(200).send(doc);
    })
    .catch(err => res.status(500).json(err));
});

// ✅ Delete enrollment by ID
router.delete("/enrollment", (req, res) => {
  enrollmodel
    .findOneAndRemove({ _id: req.query.id })
    .then(doc => res.json(doc))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
