const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const keys = require("../../config/keys");
const User = require("../../models/User");

// Validation functions
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    }

    const avatar = gravatar.url(req.body.email, {
      s: "200",
      r: "pg",
      d: "mm"
    });

    const newUser = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
      avatar
    });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser
          .save()
          .then(user => res.json(user))
          .catch(err => res.status(500).json({ error: "Saving user failed" }));
      });
    });
  });
});

// @route   POST /api/users/login
// @desc    Log in user and return JWT token
// @access  Public
router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }

      const payload = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        avatar: user.avatar,
        role: user.role
      };

      jwt.sign(
        payload,
        keys.secretOrKey,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            success: true,
            token: "Bearer " + token,
            first_name: user.first_name,
            last_name: user.last_name
          });
        }
      );
    });
  });
});

// @route   GET /api/users/current
// @desc    Return current user (from token)
// @access  Private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      first_name: req.user.first_name,
      email: req.user.email,
      role: req.user.role
    });
  }
);

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get("/", (req, res) => {
  User.find()
    .then(users => {
      res.setHeader("Content-Range", `users 0-${users.length}/${users.length}`);
      res.json(users);
    })
    .catch(err => res.status(500).json({ error: "Failed to fetch users" }));
});

// @route   POST /api/users
// @desc    Create a user
// @access  Public
router.post("/", (req, res) => {
  if (!req.body) return res.status(400).send("Missing request body");

  const model = new User(req.body);
  model
    .save()
    .then(doc => res.status(200).send(doc))
    .catch(err => res.status(500).json(err));
});

// @route   GET /api/users/user?id=USER_ID
// @desc    Get single user by ID
// @access  Public
router.get("/user", (req, res) => {
  User.findById(req.query.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
});

// @route   PUT /api/users/user?id=USER_ID
// @desc    Update user by ID
// @access  Public
router.put("/user", (req, res) => {
  User.findByIdAndUpdate(req.query.id, req.body, { new: true })
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
});

// @route   DELETE /api/users/user?id=USER_ID
// @desc    Delete user by ID
// @access  Public
router.delete("/user", (req, res) => {
  User.findByIdAndRemove(req.query.id)
    .then(user => res.json(user))
    .catch(err => res.status(500).json(err));
});

module.exports = router;
