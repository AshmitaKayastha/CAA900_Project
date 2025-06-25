const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const fileUpload = require("express-fileupload");
const cors = require("cors");

const app = express();

// =======================
// 🔐 MongoDB URI
// =======================
const db = require("./config/keys").mongoURI;

// =======================
// 🌐 CORS Configuration
// =======================
const corsOptions = {
  origin: "http://localhost:3000", // React frontend
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type, Authorization"
};

app.use(cors(corsOptions));

// =======================
// 📦 Middleware
// =======================
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
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection failed:", err));

// =======================
// 🚀 Test Route
// =======================
app.get("/", (req, res) => res.send("API is running!"));

// =======================
// 📦 API Routes
// =======================
app.use("/api/users", require("./routes/api/users"));
app.use("/api/course", require("./routes/api/course"));
app.use("/api/category", require("./routes/api/category"));
app.use("/api/enrollment", require("./routes/api/enrollRoute"));
app.use("/api/role", require("./routes/api/role"));
app.use("/api/lecture", require("./routes/api/lecture"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/instructor", require("./routes/api/instructor"));

// =======================
// 🖥️ Start Server on Port 5001
// =======================
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));