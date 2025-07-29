const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const fileUpload = require("express-fileupload");

const app = express();

// =======================
// 🔗 MongoDB Connection
// =======================
const db = require("./config/keys").mongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// =======================
// 🌐 CORS (Optional: adjust for production)
// =======================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://192.168.178.1:3000"
];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

// =======================
// 📦 Middleware
// =======================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(fileUpload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(passport.initialize());
require("./config/passport")(passport);

// =======================
// 🛣 API Routes
// =======================
app.get("/api", (req, res) => res.send("✅ API is running!"));

app.use("/api/users", require("./routes/api/users"));
app.use("/api/course", require("./routes/api/course"));
app.use("/api/courses", require("./routes/api/course"));
app.use("/api/category", require("./routes/api/category"));
app.use("/api/enrollment", require("./routes/api/enrollRoute"));
app.use("/api/role", require("./routes/api/role"));
app.use("/api/lecture", require("./routes/api/lecture"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/instructor", require("./routes/api/instructor"));

// =======================
// 🚀 Serve React Frontend
// =======================

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// =======================
// 🔊 Start Server
// =======================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
