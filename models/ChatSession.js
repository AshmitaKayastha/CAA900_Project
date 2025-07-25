const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  role: {
    type: String,
    enum: ["user", "assistant", "system"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  sources: [{
    documentId: {
      type: Schema.Types.ObjectId,
      ref: "Document"
    },
    chunkId: String,
    relevanceScore: Number,
    content: String
  }]
});

const ChatSessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: false // Can be null for general queries
    },
    sessionTitle: {
      type: String,
      required: true
    },
    messages: [MessageSchema],
    isActive: {
      type: Boolean,
      default: true
    },
    sessionType: {
      type: String,
      enum: ["course_specific", "general", "assignment_help"],
      default: "general"
    },
    metadata: {
      totalMessages: {
        type: Number,
        default: 0
      },
      lastActivity: {
        type: Date,
        default: Date.now
      },
      avgResponseTime: Number,
      userSatisfaction: {
        type: Number,
        min: 1,
        max: 5
      }
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
ChatSessionSchema.index({ user: 1, isActive: 1 });
ChatSessionSchema.index({ course: 1 });
ChatSessionSchema.index({ "metadata.lastActivity": -1 });

// Update metadata before saving
ChatSessionSchema.pre('save', function(next) {
  this.metadata.totalMessages = this.messages.length;
  this.metadata.lastActivity = new Date();
  next();
});

module.exports = mongoose.model("ChatSession", ChatSessionSchema);