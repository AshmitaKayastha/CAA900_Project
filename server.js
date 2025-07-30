const express = require("express");
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require("express-fileupload");
require("dotenv").config(); // Optional: for .env support

const app = express();

// =======================
// 🔗 MongoDB Connection
// =======================
const db = process.env.MONGO_URI || require("./config/keys").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// =======================
// 🌐 CORS (allow frontend)
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://elearners-g3gshfgvbhetg0fp.canadacentral-01.azurewebsites.net",
  "https://elearners-g3gshfgvbhetgefp.canadacentral-01.azurewebsites.net", // Alternative domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      console.log("🌐 CORS check for origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("✅ CORS allowed for:", origin);
        callback(null, true);
      } else {
        console.log("❌ CORS blocked for:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(passport.initialize());
require("./config/passport")(passport);

// =======================
// 🏥 Health Check Endpoint
// =======================
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// =======================
// 🔗 API Routes
// =======================
app.use("/api/users", require("./routes/api/users"));
app.use("/api/course", require("./routes/api/course"));
app.use("/api/courses", require("./routes/api/course")); // optional duplicate
app.use("/api/category", require("./routes/api/category"));
app.use("/api/enrollment", require("./routes/api/enrollRoute"));
app.use("/api/role", require("./routes/api/role"));
app.use("/api/lecture", require("./routes/api/lecture"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/instructor", require("./routes/api/instructor"));

// =======================
// ✅ Serve React Frontend from /build (corrected path)
// =======================
const buildPath = path.join(__dirname, "build"); // Not client/build

// Check if build directory exists
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
} else {
  console.warn("⚠️ Build directory not found, serving API only");
  app.get("/", (req, res) => {
    res.json({ 
      message: "E-Learning API is running", 
      status: "API only mode - frontend not built",
      timestamp: new Date().toISOString()
    });
  });
}

// =======================
// 🔊 Start Server
// =======================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
