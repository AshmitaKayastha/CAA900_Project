const express = require("express");
const router = express.Router();
const passport = require("passport");

// ✅ Load Models
const Profile = require("../../models/Profile");
const User = require("../../models/User");

// ✅ Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

// ===========================
// @route   GET api/profile/test
// @desc    Test route
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// ===========================
// @route   GET api/profile
// @desc    Get current user's profile
// @access  Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);

      if (!profile) {
        return res.status(404).json({ noprofile: "There is no profile for this user" });
      }

      res.json(profile);
    } catch (err) {
      console.error("🔴 Error fetching profile:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   GET api/profile/all
router.get("/all", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    if (!profiles || profiles.length === 0) {
      return res.status(404).json({ noprofile: "There are no profiles" });
    }
    res.json(profiles);
  } catch (err) {
    console.error("🔴 Error fetching all profiles:", err);
    res.status(500).json({ error: "There was a problem fetching profiles" });
  }
});

// ===========================
// @route   GET api/profile/handle/:handle
router.get("/handle/:handle", async (req, res) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({ noprofile: "There is no profile for this handle" });
    }
    res.json(profile);
  } catch (err) {
    console.error("🔴 Error fetching profile by handle:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
// @route   GET api/profile/user/:user_id
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(404).json({ noprofile: "There is no profile for this user" });
    }
    res.json(profile);
  } catch (err) {
    console.error("🔴 Error fetching profile by user ID:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ===========================
// @route   POST api/profile
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const profileFields = {
      user: req.user.id,
      handle: req.body.handle || "",
      company: req.body.company || "",
      website: req.body.website || "",
      location: req.body.location || "",
      bio: req.body.bio || "",
      status: req.body.status || "",
      githubusername: req.body.githubusername || "",
      skills: typeof req.body.skills !== "undefined" ? req.body.skills.split(",") : [],
      social: {
        youtube: req.body.youtube || "",
        twitter: req.body.twitter || "",
        facebook: req.body.facebook || "",
        linkedin: req.body.linkedin || "",
        instagram: req.body.instagram || ""
      }
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        return res.json(profile);
      } else {
        const existingHandle = await Profile.findOne({ handle: profileFields.handle });
        if (existingHandle) {
          return res.status(400).json({ handle: "That handle already exists" });
        }

        profile = new Profile(profileFields);
        await profile.save();
        res.json(profile);
      }
    } catch (err) {
      console.error("🔴 Error creating/updating profile:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   POST api/profile/experience
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(404).json({ error: "Profile not found. Create one first." });

      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error("🔴 Error adding experience:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   POST api/profile/education
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (!profile) return res.status(404).json({ error: "Profile not found. Create one first." });

      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error("🔴 Error adding education:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   DELETE api/profile/experience/:exp_id
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);
      if (removeIndex === -1) return res.status(404).json({ error: "Experience not found" });

      profile.experience.splice(removeIndex, 1);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error("🔴 Error deleting experience:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   DELETE api/profile/education/:edu_id
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);
      if (removeIndex === -1) return res.status(404).json({ error: "Education not found" });

      profile.education.splice(removeIndex, 1);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error("🔴 Error deleting education:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ===========================
// @route   DELETE api/profile
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ success: true });
    } catch (err) {
      console.error("🔴 Error deleting account:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
