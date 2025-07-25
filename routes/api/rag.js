const express = require("express");
const router = express.Router();
const passport = require("passport");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// RAG Services
const ragService = require("../../services/ragService");
const documentProcessor = require("../../services/documentProcessor");
const vectorStore = require("../../services/vectorStore");

// Models
const Document = require("../../models/Document");
const ChatSession = require("../../models/ChatSession");
const Course = require("../../models/Course");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/documents/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, and TXT files are allowed"));
    }
  }
});

// @route   POST /api/rag/chat
// @desc    Process RAG chat query
// @access  Private
router.post("/chat", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { query, courseId, sessionId, sessionType = "general" } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Process the RAG query
    const result = await ragService.processQuery(userId, query, {
      courseId,
      sessionId,
      sessionType
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      error: "Failed to process chat query",
      details: error.message
    });
  }
});

// @route   POST /api/rag/upload-document
// @desc    Upload and process document for RAG
// @access  Private
router.post("/upload-document", 
  passport.authenticate("jwt", { session: false }),
  upload.single("document"),
  async (req, res) => {
    try {
      const { courseId, lectureId, title, documentType = "pdf" } = req.body;
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!courseId) {
        return res.status(400).json({ error: "Course ID is required" });
      }

      // Verify course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found" });
      }

      // Create document record
      const document = new Document({
        title: title || req.file.originalname,
        content: "", // Will be filled after processing
        course: courseId,
        lecture: lectureId || null,
        documentType: documentType,
        filePath: req.file.path,
        uploadedBy: userId,
        processingStatus: "pending"
      });

      await document.save();

      // Process document asynchronously
      processDocumentAsync(document._id, req.file.path, documentType, {
        courseId,
        lectureId,
        uploadedBy: userId
      });

      res.json({
        success: true,
        message: "Document uploaded successfully. Processing in background.",
        documentId: document._id
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to upload document",
        details: error.message
      });
    }
  }
);

// @route   GET /api/rag/chat-sessions
// @desc    Get user's chat sessions
// @access  Private
router.get("/chat-sessions", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId, limit = 20 } = req.query;

    const sessions = await ragService.getUserChatSessions(userId, {
      courseId,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({
      error: "Failed to get chat sessions",
      details: error.message
    });
  }
});

// @route   GET /api/rag/chat-history/:sessionId
// @desc    Get chat history for a session
// @access  Private
router.get("/chat-history/:sessionId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await ragService.getChatHistory(sessionId);

    // Verify user owns this session
    if (session.user.toString() !== userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error("Get chat history error:", error);
    res.status(500).json({
      error: "Failed to get chat history",
      details: error.message
    });
  }
});

// @route   POST /api/rag/search
// @desc    Search course materials
// @access  Private
router.post("/search", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { query, courseId, documentType, limit = 10 } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const results = await ragService.searchCourseMaterials(query, {
      courseId,
      documentType,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Failed to search materials",
      details: error.message
    });
  }
});

// @route   GET /api/rag/documents
// @desc    Get course documents
// @access  Private
router.get("/documents", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { courseId, documentType, isProcessed } = req.query;

    const query = {};
    if (courseId) query.course = courseId;
    if (documentType) query.documentType = documentType;
    if (isProcessed !== undefined) query.isProcessed = isProcessed === 'true';

    const documents = await Document.find(query)
      .populate("course", "courseName")
      .populate("lecture", "title")
      .populate("uploadedBy", "first_name last_name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error("Get documents error:", error);
    res.status(500).json({
      error: "Failed to get documents",
      details: error.message
    });
  }
});

// @route   GET /api/rag/document-status/:documentId
// @desc    Get document processing status
// @access  Private
router.get("/document-status/:documentId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findById(documentId)
      .populate("course", "courseName")
      .populate("lecture", "title");

    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    res.json({
      success: true,
      data: {
        id: document._id,
        title: document.title,
        processingStatus: document.processingStatus,
        isProcessed: document.isProcessed,
        chunkCount: document.chunks.length,
        course: document.course,
        lecture: document.lecture,
        createdAt: document.createdAt
      }
    });
  } catch (error) {
    console.error("Get document status error:", error);
    res.status(500).json({
      error: "Failed to get document status",
      details: error.message
    });
  }
});

// @route   DELETE /api/rag/document/:documentId
// @desc    Delete document and its vectors
// @access  Private
router.delete("/document/:documentId", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ error: "Document not found" });
    }

    // Check if user owns the document or is an instructor
    if (document.uploadedBy.toString() !== userId && req.user.role !== "instructor") {
      return res.status(403).json({ error: "Access denied" });
    }

    // Delete from vector store
    await vectorStore.deleteDocumentChunks(documentId);

    // Delete file if exists
    if (document.filePath && fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete document record
    await Document.findByIdAndDelete(documentId);

    res.json({
      success: true,
      message: "Document deleted successfully"
    });
  } catch (error) {
    console.error("Delete document error:", error);
    res.status(500).json({
      error: "Failed to delete document",
      details: error.message
    });
  }
});

// @route   GET /api/rag/stats
// @desc    Get RAG system statistics
// @access  Private
router.get("/stats", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const { courseId } = req.query;

    // Get vector store stats
    const vectorStats = await vectorStore.getStats();

    // Get document stats
    const documentQuery = courseId ? { course: courseId } : {};
    const totalDocuments = await Document.countDocuments(documentQuery);
    const processedDocuments = await Document.countDocuments({
      ...documentQuery,
      isProcessed: true
    });

    // Get chat session stats
    const chatQuery = courseId ? { course: courseId } : {};
    const totalSessions = await ChatSession.countDocuments(chatQuery);
    const activeSessions = await ChatSession.countDocuments({
      ...chatQuery,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        vectorStore: vectorStats,
        documents: {
          total: totalDocuments,
          processed: processedDocuments,
          pending: totalDocuments - processedDocuments
        },
        chatSessions: {
          total: totalSessions,
          active: activeSessions
        }
      }
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      error: "Failed to get statistics",
      details: error.message
    });
  }
});

// Async function to process documents in background
async function processDocumentAsync(documentId, filePath, documentType, metadata) {
  try {
    // Update status to processing
    await documentProcessor.updateProcessingStatus(documentId, "processing");

    // Process the document
    const result = await documentProcessor.processDocument(filePath, documentType, metadata);

    // Update document with processed content
    const document = await Document.findByIdAndUpdate(
      documentId,
      {
        content: result.content,
        chunks: result.chunks,
        processingStatus: "completed",
        isProcessed: true
      },
      { new: true }
    );

    // Add to vector store
    await vectorStore.addDocumentChunks(documentId, result.chunks, {
      courseId: metadata.courseId,
      documentType: documentType,
      title: document.title
    });

    console.log(`✅ Document ${documentId} processed successfully`);
  } catch (error) {
    console.error(`❌ Error processing document ${documentId}:`, error);
    await documentProcessor.updateProcessingStatus(documentId, "failed", error.message);
  }
}

module.exports = router;