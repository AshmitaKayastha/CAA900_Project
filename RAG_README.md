# 🤖 RAG (Retrieval-Augmented Generation) Implementation

This implementation adds intelligent AI assistance to your e-learning platform using RAG technology. Students can now chat with an AI assistant that has access to course materials and can provide contextual answers based on uploaded documents.

## 🌟 Features

### Core RAG Capabilities
- **Document Processing**: Upload and process PDF, DOC, DOCX, and TXT files
- **Vector Embeddings**: Automatic text chunking and embedding generation
- **Semantic Search**: Find relevant content using vector similarity
- **AI Chat Assistant**: Context-aware responses using OpenAI/Azure OpenAI
- **Source Attribution**: Track which documents were used for answers
- **Chat History**: Persistent conversation sessions

### Technical Features
- **Multiple LLM Support**: OpenAI GPT or Azure OpenAI
- **Vector Databases**: ChromaDB (local) or Pinecone (cloud)
- **Async Processing**: Background document processing
- **Real-time Chat**: WebSocket-ready architecture
- **Responsive UI**: Mobile-friendly React components

## 🚀 Quick Start

### 1. Install Dependencies
```bash
node setup-rag.js
```

### 2. Configure Environment
Update your `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# Alternative: Azure OpenAI
USE_AZURE_OPENAI=false
AZURE_OPENAI_ENDPOINT=your_azure_endpoint
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment

# Database
MONGO_URI=mongodb://localhost:27017/elearning

# Vector Database (Choose one)
VECTOR_DB_TYPE=chroma  # or 'pinecone'
CHROMA_DB_PATH=./vector_db
# PINECONE_API_KEY=your_pinecone_key
# PINECONE_ENVIRONMENT=your_env
# PINECONE_INDEX_NAME=elearning-rag

# RAG Settings
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
MAX_CONTEXT_LENGTH=4000
```

### 3. Start the Application
```bash
# Backend only
npm run server

# Frontend only
cd client && npm start

# Both together
npm run dev
```

## 📚 Usage

### Adding RAG to Your Components

#### 1. Chat Assistant
```jsx
import RAGChat from './components/RAGChat';

function CoursePage({ courseId, userId }) {
  return (
    <div>
      <h1>Course Content</h1>
      
      {/* Add AI Chat Assistant */}
      <RAGChat 
        courseId={courseId} 
        userId={userId} 
      />
    </div>
  );
}
```

#### 2. Document Upload
```jsx
import DocumentUpload from './components/DocumentUpload';

function CourseManagement({ courseId }) {
  return (
    <div>
      <h1>Manage Course Materials</h1>
      
      {/* Add Document Upload */}
      <DocumentUpload 
        courseId={courseId}
        onUploadComplete={(documentId) => {
          console.log('Document uploaded:', documentId);
        }}
      />
    </div>
  );
}
```

### API Integration

#### Chat with AI Assistant
```javascript
const response = await fetch('/api/rag/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "What are the main concepts in this course?",
    courseId: "course_id_here",
    sessionType: "course_specific"
  })
});

const result = await response.json();
console.log('AI Response:', result.data.response);
console.log('Sources:', result.data.sources);
```

#### Upload Documents
```javascript
const formData = new FormData();
formData.append('document', file);
formData.append('courseId', courseId);
formData.append('title', 'Lecture Notes');
formData.append('documentType', 'pdf');

const response = await fetch('/api/rag/upload-document', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

#### Search Course Materials
```javascript
const response = await fetch('/api/rag/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: "machine learning algorithms",
    courseId: courseId,
    limit: 10
  })
});

const results = await response.json();
```

## 🏗️ Architecture

### Backend Components

```
services/
├── ragService.js          # Main RAG orchestration
├── documentProcessor.js   # Text extraction & chunking
├── vectorStore.js         # Vector database operations
└── config/
    └── ragConfig.js       # OpenAI & configuration

models/
├── Document.js           # Document storage schema
└── ChatSession.js        # Chat history schema

routes/api/
└── rag.js               # RAG API endpoints
```

### Frontend Components

```
client/src/components/
├── RAGChat.js           # AI chat interface
├── RAGChat.css          # Chat styling
├── DocumentUpload.js    # File upload component
└── DocumentUpload.css   # Upload styling
```

### Data Flow

1. **Document Upload** → Text Extraction → Chunking → Embedding Generation → Vector Store
2. **User Query** → Embedding Generation → Vector Search → Context Retrieval → LLM Generation → Response

## 🔧 Configuration

### Model Settings
```javascript
// In ragConfig.js
const config = {
  chatModel: 'gpt-3.5-turbo',
  embeddingModel: 'text-embedding-ada-002',
  maxContextLength: 4000,
  chunkSize: 1000,
  chunkOverlap: 200,
  maxRetrievedChunks: 5,
  similarityThreshold: 0.7
};
```

### System Prompts
Customize AI behavior by modifying system prompts in `ragConfig.js`:

```javascript
systemPrompts: {
  general: `You are an intelligent educational assistant...`,
  courseSpecific: `You are a specialized tutor for this course...`,
  assignmentHelp: `You are an academic assistant helping with assignments...`
}
```

## 📊 API Reference

### Chat Endpoints
- `POST /api/rag/chat` - Send message to AI assistant
- `GET /api/rag/chat-sessions` - Get user's chat sessions
- `GET /api/rag/chat-history/:sessionId` - Get chat history

### Document Management
- `POST /api/rag/upload-document` - Upload course material
- `GET /api/rag/documents` - List uploaded documents
- `DELETE /api/rag/document/:id` - Delete document
- `GET /api/rag/document-status/:id` - Check processing status

### Search & Analytics
- `POST /api/rag/search` - Search course materials
- `GET /api/rag/stats` - System statistics

## 🎯 Use Cases

### For Students
- **Ask Questions**: "Can you explain the concept of neural networks?"
- **Get Summaries**: "What are the key points from today's lecture?"
- **Assignment Help**: "Help me understand this problem"
- **Exam Preparation**: "What should I focus on for the exam?"

### For Instructors
- **Content Management**: Upload lecture slides, notes, assignments
- **Student Analytics**: See what topics students ask about most
- **Content Gaps**: Identify areas where students need more help

### For Administrators
- **System Monitoring**: Track RAG system performance
- **Usage Analytics**: Understand how AI assistance is being used
- **Resource Planning**: Monitor storage and API usage

## 🛠️ Troubleshooting

### Common Issues

#### 1. Documents Not Processing
```bash
# Check processing status
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5001/api/rag/document-status/DOCUMENT_ID

# Check logs
tail -f logs/rag.log
```

#### 2. Chat Not Working
- Verify OpenAI API key in `.env`
- Check vector database connection
- Ensure documents are processed (`isProcessed: true`)

#### 3. Vector Store Issues
```bash
# Reset ChromaDB
rm -rf ./vector_db
# Restart server to recreate
```

### Performance Optimization

#### 1. Chunk Size Tuning
```env
# Smaller chunks = more precise, larger chunks = more context
CHUNK_SIZE=800          # For technical content
CHUNK_SIZE=1200         # For narrative content
```

#### 2. Embedding Batch Processing
```javascript
// Process multiple documents in parallel
const results = await Promise.all(
  documents.map(doc => documentProcessor.processDocument(doc))
);
```

## 🔒 Security Considerations

### Data Privacy
- Documents are stored locally or in your vector database
- Chat history is encrypted and user-specific
- API keys are environment-variable protected

### Access Control
- All endpoints require JWT authentication
- Users can only access their own chat sessions
- Instructors can manage course documents

### Rate Limiting
```javascript
// Add to your middleware
const rateLimit = require('express-rate-limit');

const ragLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});

app.use('/api/rag', ragLimiter);
```

## 📈 Monitoring & Analytics

### System Metrics
```javascript
// Get RAG statistics
const stats = await fetch('/api/rag/stats');
const data = await stats.json();

console.log('Documents processed:', data.documents.processed);
console.log('Active chat sessions:', data.chatSessions.active);
console.log('Vector store size:', data.vectorStore.totalChunks);
```

### Performance Monitoring
- Response times for chat queries
- Document processing success rates
- Vector search accuracy metrics
- API usage and costs

## 🤝 Contributing

### Adding New Document Types
1. Extend `documentProcessor.js` with new extraction logic
2. Update file type validation in upload endpoints
3. Add UI support in `DocumentUpload.js`

### Custom Vector Stores
1. Implement vector store interface in `services/vectorStore.js`
2. Add configuration options in `ragConfig.js`
3. Update environment variables

### Enhanced AI Features
1. Add new system prompts for different contexts
2. Implement conversation memory and context
3. Add multi-modal support (images, audio)

## 📝 License

This RAG implementation is part of your e-learning platform and follows the same license terms.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review API documentation
3. Check server logs for error details
4. Verify environment configuration

---

**Happy Learning with AI! 🤖📚**