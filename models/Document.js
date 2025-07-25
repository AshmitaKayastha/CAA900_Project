const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    lecture: {
      type: Schema.Types.ObjectId,
      ref: "lectures",
      required: false
    },
    documentType: {
      type: String,
      enum: ["pdf", "video_transcript", "text", "slides", "assignment"],
      required: true
    },
    filePath: {
      type: String,
      required: false
    },
    chunks: [{
      chunkId: String,
      content: String,
      embedding: [Number], // Store vector embeddings
      metadata: {
        startIndex: Number,
        endIndex: Number,
        chunkNumber: Number
      }
    }],
    vectorId: {
      type: String, // For external vector DB reference
      required: false
    },
    isProcessed: {
      type: Boolean,
      default: false
    },
    processingStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Index for efficient search
DocumentSchema.index({ course: 1, documentType: 1 });
DocumentSchema.index({ "chunks.chunkId": 1 });
DocumentSchema.index({ isProcessed: 1 });

module.exports = mongoose.model("Document", DocumentSchema);