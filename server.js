const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// Routes
const users = require("./routes/api/users");
const course = require("./routes/api/course");
const category = require("./routes/api/category");
const enroll = require("./routes/api/enrollRoute");
const role = require("./routes/api/role");
const lecture = require("./routes/api/lecture");
const profile = require("./routes/api/profile");

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

// Passport Middleware
app.use(passport.initialize());
require("./config/passport")(passport);

// Middleware
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(cors());
app.options("*", cors());

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test Route
app.get("/", (req, res) => res.send("Hello World"));

// API Routes
app.use("/api/users", users);
app.use("/api/courses", course);
app.use("/api/categories", category);
app.use("/api/lectures", lecture);
app.use("/api/enrollments", enroll);
app.use("/api/roles", role);
app.use("/api/profile", profile);

// Server Port
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
