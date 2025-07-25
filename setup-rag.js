#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up RAG (Retrieval-Augmented Generation) for E-Learning Platform...\n');

// Function to run commands
function runCommand(command, description) {
  console.log(`📦 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed\n`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

// Function to create directories
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
}

// Main setup function
async function setupRAG() {
  try {
    // 1. Install backend dependencies
    console.log('🔧 Installing backend dependencies...');
    runCommand('npm install', 'Backend dependencies installation');

    // 2. Install client dependencies
    console.log('🔧 Installing frontend dependencies...');
    runCommand('cd client && npm install', 'Frontend dependencies installation');

    // 3. Create required directories
    console.log('📁 Creating required directories...');
    createDirectory('./uploads/documents');
    createDirectory('./vector_db');
    createDirectory('./logs');

    // 4. Copy environment template
    console.log('⚙️ Setting up environment configuration...');
    if (!fs.existsSync('.env')) {
      console.log('📄 .env file already exists');
    } else {
      console.log('✅ .env file is ready for configuration');
    }

    // 5. Display configuration instructions
    console.log('\n🎉 RAG Setup Complete!\n');
    console.log('📋 Next Steps:');
    console.log('1. Configure your .env file with the following variables:');
    console.log('   - OPENAI_API_KEY (or Azure OpenAI credentials)');
    console.log('   - MONGO_URI (your MongoDB connection string)');
    console.log('   - JWT_SECRET (for authentication)');
    console.log('');
    console.log('2. Optional: Set up vector database (Pinecone or use local ChromaDB)');
    console.log('   - PINECONE_API_KEY and PINECONE_ENVIRONMENT (for Pinecone)');
    console.log('   - Or leave CHROMA_DB_PATH for local ChromaDB');
    console.log('');
    console.log('3. Start the development servers:');
    console.log('   Backend: npm run server');
    console.log('   Frontend: cd client && npm start');
    console.log('   Both: npm run dev');
    console.log('');
    console.log('🔍 Features included:');
    console.log('   ✅ Document upload and processing (PDF, DOC, TXT)');
    console.log('   ✅ Vector embeddings with ChromaDB/Pinecone');
    console.log('   ✅ AI chat assistant with course context');
    console.log('   ✅ Semantic search across course materials');
    console.log('   ✅ Chat history and session management');
    console.log('   ✅ Source attribution and relevance scoring');
    console.log('');
    console.log('📚 API Endpoints:');
    console.log('   POST /api/rag/chat - Chat with AI assistant');
    console.log('   POST /api/rag/upload-document - Upload course materials');
    console.log('   GET /api/rag/chat-sessions - Get chat history');
    console.log('   POST /api/rag/search - Search course materials');
    console.log('   GET /api/rag/documents - List uploaded documents');
    console.log('   GET /api/rag/stats - RAG system statistics');
    console.log('');
    console.log('🎯 Usage in your React components:');
    console.log('   import RAGChat from "./components/RAGChat";');
    console.log('   import DocumentUpload from "./components/DocumentUpload";');
    console.log('');
    console.log('   <RAGChat courseId={courseId} userId={userId} />');
    console.log('   <DocumentUpload courseId={courseId} />');
    console.log('');
    console.log('🔧 Configuration Options:');
    console.log('   - Switch between OpenAI and Azure OpenAI');
    console.log('   - Adjust chunk size and overlap for documents');
    console.log('   - Configure similarity thresholds');
    console.log('   - Customize system prompts for different contexts');
    console.log('');
    console.log('Happy learning with AI! 🤖📚');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Check if this is being run directly
if (require.main === module) {
  setupRAG();
}

module.exports = { setupRAG };