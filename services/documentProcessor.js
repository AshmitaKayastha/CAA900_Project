const fs = require('fs').promises;
const path = require('path');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const natural = require('natural');
const ragConfig = require('../config/ragConfig');
const Document = require('../models/Document');

class DocumentProcessor {
  constructor() {
    this.config = ragConfig.getConfig();
  }

  /**
   * Process uploaded document and extract text content
   */
  async processDocument(filePath, documentType, metadata = {}) {
    try {
      let extractedText = '';
      
      switch (documentType) {
        case 'pdf':
          extractedText = await this.extractTextFromPDF(filePath);
          break;
        case 'docx':
          extractedText = await this.extractTextFromDOCX(filePath);
          break;
        case 'txt':
          extractedText = await this.extractTextFromTXT(filePath);
          break;
        default:
          throw new Error(`Unsupported document type: ${documentType}`);
      }

      // Clean and preprocess text
      const cleanedText = this.cleanText(extractedText);
      
      // Create chunks
      const chunks = this.createChunks(cleanedText);
      
      // Generate embeddings for chunks
      const chunksWithEmbeddings = await this.generateEmbeddingsForChunks(chunks);
      
      return {
        content: cleanedText,
        chunks: chunksWithEmbeddings,
        metadata: {
          ...metadata,
          wordCount: this.getWordCount(cleanedText),
          chunkCount: chunks.length,
          processedAt: new Date()
        }
      };
    } catch (error) {
      console.error('Error processing document:', error);
      throw error;
    }
  }

  /**
   * Extract text from PDF files
   */
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }

  /**
   * Extract text from DOCX files
   */
  async extractTextFromDOCX(filePath) {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const result = await mammoth.extractRawText({ buffer: dataBuffer });
      return result.value;
    } catch (error) {
      console.error('Error extracting text from DOCX:', error);
      throw error;
    }
  }

  /**
   * Extract text from TXT files
   */
  async extractTextFromTXT(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      console.error('Error extracting text from TXT:', error);
      throw error;
    }
  }

  /**
   * Clean and preprocess text
   */
  cleanText(text) {
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .replace(/[^\w\s\.\,\!\?\;\:\-\(\)]/g, '') // Remove special characters
      .trim();
  }

  /**
   * Create text chunks for vector embedding
   */
  createChunks(text) {
    const sentences = this.splitIntoSentences(text);
    const chunks = [];
    let currentChunk = '';
    let chunkNumber = 0;
    let startIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      const potentialChunk = currentChunk + (currentChunk ? ' ' : '') + sentence;

      if (potentialChunk.length <= this.config.chunkSize) {
        currentChunk = potentialChunk;
      } else {
        // Save current chunk if it's not empty
        if (currentChunk) {
          chunks.push({
            chunkId: `chunk_${chunkNumber}`,
            content: currentChunk,
            metadata: {
              startIndex: startIndex,
              endIndex: startIndex + currentChunk.length,
              chunkNumber: chunkNumber
            }
          });
          chunkNumber++;
          startIndex += currentChunk.length;
        }

        // Start new chunk with current sentence
        currentChunk = sentence;
      }
    }

    // Add the last chunk if it exists
    if (currentChunk) {
      chunks.push({
        chunkId: `chunk_${chunkNumber}`,
        content: currentChunk,
        metadata: {
          startIndex: startIndex,
          endIndex: startIndex + currentChunk.length,
          chunkNumber: chunkNumber
        }
      });
    }

    return chunks;
  }

  /**
   * Split text into sentences using Natural library
   */
  splitIntoSentences(text) {
    const tokenizer = new natural.SentenceTokenizer();
    return tokenizer.tokenize(text);
  }

  /**
   * Generate embeddings for text chunks
   */
  async generateEmbeddingsForChunks(chunks) {
    const chunksWithEmbeddings = [];

    for (const chunk of chunks) {
      try {
        const embedding = await ragConfig.generateEmbedding(chunk.content);
        chunksWithEmbeddings.push({
          ...chunk,
          embedding: embedding
        });
      } catch (error) {
        console.error(`Error generating embedding for chunk ${chunk.chunkId}:`, error);
        // Continue with other chunks even if one fails
        chunksWithEmbeddings.push({
          ...chunk,
          embedding: null
        });
      }
    }

    return chunksWithEmbeddings;
  }

  /**
   * Get word count of text
   */
  getWordCount(text) {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Process video transcript
   */
  async processVideoTranscript(transcript, videoMetadata = {}) {
    try {
      const cleanedTranscript = this.cleanText(transcript);
      const chunks = this.createChunks(cleanedTranscript);
      const chunksWithEmbeddings = await this.generateEmbeddingsForChunks(chunks);

      return {
        content: cleanedTranscript,
        chunks: chunksWithEmbeddings,
        metadata: {
          ...videoMetadata,
          wordCount: this.getWordCount(cleanedTranscript),
          chunkCount: chunks.length,
          processedAt: new Date(),
          type: 'video_transcript'
        }
      };
    } catch (error) {
      console.error('Error processing video transcript:', error);
      throw error;
    }
  }

  /**
   * Update document processing status
   */
  async updateProcessingStatus(documentId, status, errorMessage = null) {
    try {
      const updateData = { 
        processingStatus: status,
        isProcessed: status === 'completed'
      };
      
      if (errorMessage) {
        updateData.errorMessage = errorMessage;
      }

      await Document.findByIdAndUpdate(documentId, updateData);
    } catch (error) {
      console.error('Error updating processing status:', error);
    }
  }
}

module.exports = new DocumentProcessor();