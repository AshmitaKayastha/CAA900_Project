const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// Initialize Express App
const app = express();

// =======================
// 🔗 MongoDB Configuration
// =======================
const db = require("./config/keys").mongoURI;

// =======================
// 🔧 Middleware Setup
// =======================
app.use("/api/instructor", require("./routes/api/instructor"));

app.use(cors());
app.options("*", cors());

app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

// =======================
// 🔐 Passport Setup
// =======================
app.use(passport.initialize());
require("./config/passport")(passport);

// =======================
// 🌐 MongoDB Connection
// =======================
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

// =======================
// 🚀 Test Route
// =======================
app.get("/", (req, res) => res.send("🎉 API is running!"));

// =======================
// 📦 API Routes
// =======================
app.use("/api/users", require("./routes/api/users"));
app.use("/api/course", require("./routes/api/course"));           // Courses endpoint
app.use("/api/category", require("./routes/api/category"));       // Categories endpoint
app.use("/api/enrollment", require("./routes/api/enrollRoute"));  // Enrollment endpoint
app.use("/api/role", require("./routes/api/role"));               // Roles endpoint
app.use("/api/lecture", require("./routes/api/lecture"));         // Lectures endpoint
app.use("/api/profile", require("./routes/api/profile"));         // Profiles endpoint

// =======================
// 🖥️ Start Server
// =======================
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
