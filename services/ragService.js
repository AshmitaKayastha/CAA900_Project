const ragConfig = require('../config/ragConfig');
const vectorStore = require('./vectorStore');
const Document = require('../models/Document');
const ChatSession = require('../models/ChatSession');
const Course = require('../models/Course');

class RAGService {
  constructor() {
    this.config = ragConfig.getConfig();
  }

  /**
   * Main RAG query processing function
   */
  async processQuery(userId, query, options = {}) {
    try {
      const {
        courseId = null,
        sessionId = null,
        sessionType = 'general',
        maxTokens = 1000,
        temperature = 0.7
      } = options;

      // Step 1: Retrieve relevant context
      const retrievalResults = await this.retrieveRelevantContext(query, {
        courseId,
        maxResults: this.config.maxRetrievedChunks
      });

      // Step 2: Generate response using retrieved context
      const response = await this.generateResponse(query, retrievalResults, {
        sessionType,
        courseId,
        maxTokens,
        temperature
      });

      // Step 3: Save conversation to chat session
      const chatSession = await this.saveChatInteraction(
        userId,
        query,
        response,
        retrievalResults,
        {
          courseId,
          sessionId,
          sessionType
        }
      );

      return {
        response: response.content,
        sources: response.sources,
        sessionId: chatSession._id,
        metadata: {
          retrievedChunks: retrievalResults.length,
          totalTokens: response.totalTokens,
          processingTime: response.processingTime
        }
      };
    } catch (error) {
      console.error('❌ Error processing RAG query:', error);
      throw error;
    }
  }

  /**
   * Retrieve relevant context from vector store
   */
  async retrieveRelevantContext(query, options = {}) {
    try {
      const { courseId, maxResults = 5, documentType = null } = options;

      // Generate query embedding
      const queryEmbedding = await ragConfig.generateEmbedding(query);

      // Search options
      const searchOptions = {
        nResults: maxResults
      };

      // Add course filter if specified
      if (courseId) {
        searchOptions.where = { courseId: courseId };
      }

      // Add document type filter if specified
      if (documentType) {
        searchOptions.where = {
          ...searchOptions.where,
          documentType: documentType
        };
      }

      // Perform vector search
      const searchResults = await vectorStore.searchSimilarChunks(
        queryEmbedding,
        searchOptions
      );

      // Enhance results with document information
      const enhancedResults = await this.enhanceSearchResults(searchResults);

      return enhancedResults;
    } catch (error) {
      console.error('❌ Error retrieving relevant context:', error);
      throw error;
    }
  }

  /**
   * Enhance search results with additional document metadata
   */
  async enhanceSearchResults(searchResults) {
    try {
      const enhancedResults = [];

      for (const result of searchResults) {
        const documentId = result.metadata.documentId;
        
        // Get document details
        const document = await Document.findById(documentId)
          .populate('course', 'courseName')
          .populate('lecture', 'title');

        if (document) {
          enhancedResults.push({
            ...result,
            documentInfo: {
              title: document.title,
              type: document.documentType,
              courseName: document.course?.courseName,
              lectureTitle: document.lecture?.title
            }
          });
        } else {
          enhancedResults.push(result);
        }
      }

      return enhancedResults;
    } catch (error) {
      console.error('❌ Error enhancing search results:', error);
      return searchResults; // Return original results if enhancement fails
    }
  }

  /**
   * Generate response using LLM with retrieved context
   */
  async generateResponse(query, retrievalResults, options = {}) {
    try {
      const startTime = Date.now();
      const {
        sessionType = 'general',
        courseId = null,
        maxTokens = 1000,
        temperature = 0.7
      } = options;

      // Build context from retrieved chunks
      const context = this.buildContext(retrievalResults);

      // Get appropriate system prompt
      const systemPrompt = this.getSystemPrompt(sessionType, courseId);

      // Build conversation messages
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: this.buildUserPrompt(query, context)
        }
      ];

      // Generate response using LLM
      const responseContent = await ragConfig.generateChatCompletion(messages, {
        maxTokens,
        temperature
      });

      const processingTime = Date.now() - startTime;

      return {
        content: responseContent,
        sources: this.formatSources(retrievalResults),
        totalTokens: this.estimateTokens(messages, responseContent),
        processingTime
      };
    } catch (error) {
      console.error('❌ Error generating response:', error);
      throw error;
    }
  }

  /**
   * Build context string from retrieved chunks
   */
  buildContext(retrievalResults) {
    if (!retrievalResults || retrievalResults.length === 0) {
      return "No relevant context found in the course materials.";
    }

    let context = "Relevant information from course materials:\n\n";
    
    retrievalResults.forEach((result, index) => {
      const source = result.documentInfo 
        ? `${result.documentInfo.title} (${result.documentInfo.type})`
        : 'Unknown source';
      
      context += `[Source ${index + 1}: ${source}]\n`;
      context += `${result.content}\n\n`;
    });

    return context;
  }

  /**
   * Get appropriate system prompt based on session type
   */
  getSystemPrompt(sessionType, courseId = null) {
    const basePrompt = this.config.systemPrompts[sessionType] || this.config.systemPrompts.general;
    
    if (courseId) {
      return basePrompt + "\n\nYou are specifically helping with course materials. " +
             "Use the provided context to answer questions accurately. " +
             "If the context doesn't contain enough information, clearly state that.";
    }
    
    return basePrompt;
  }

  /**
   * Build user prompt with query and context
   */
  buildUserPrompt(query, context) {
    return `Context Information:
${context}

User Question: ${query}

Please provide a helpful and accurate answer based on the context provided. If the context doesn't contain enough information to fully answer the question, please indicate what information is missing and suggest how the user might find it.`;
  }

  /**
   * Format sources for response
   */
  formatSources(retrievalResults) {
    return retrievalResults.map((result, index) => ({
      id: index + 1,
      title: result.documentInfo?.title || 'Unknown Document',
      type: result.documentInfo?.type || 'unknown',
      courseName: result.documentInfo?.courseName,
      lectureTitle: result.documentInfo?.lectureTitle,
      relevanceScore: result.similarity,
      excerpt: result.content.substring(0, 200) + '...'
    }));
  }

  /**
   * Estimate token count (rough approximation)
   */
  estimateTokens(messages, response) {
    const totalText = messages.map(m => m.content).join(' ') + response;
    return Math.ceil(totalText.length / 4); // Rough approximation: 4 chars per token
  }

  /**
   * Save chat interaction to database
   */
  async saveChatInteraction(userId, query, response, retrievalResults, options = {}) {
    try {
      const { courseId, sessionId, sessionType = 'general' } = options;

      let chatSession;

      if (sessionId) {
        // Update existing session
        chatSession = await ChatSession.findById(sessionId);
        if (!chatSession) {
          throw new Error('Chat session not found');
        }
      } else {
        // Create new session
        chatSession = new ChatSession({
          user: userId,
          course: courseId,
          sessionTitle: this.generateSessionTitle(query),
          sessionType: sessionType,
          messages: []
        });
      }

      // Add user message
      chatSession.messages.push({
        role: 'user',
        content: query,
        timestamp: new Date()
      });

      // Add assistant message with sources
      chatSession.messages.push({
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        sources: retrievalResults.map(result => ({
          documentId: result.metadata.documentId,
          chunkId: result.metadata.chunkId,
          relevanceScore: result.similarity,
          content: result.content.substring(0, 500)
        }))
      });

      await chatSession.save();
      return chatSession;
    } catch (error) {
      console.error('❌ Error saving chat interaction:', error);
      throw error;
    }
  }

  /**
   * Generate session title from first query
   */
  generateSessionTitle(query) {
    const words = query.split(' ').slice(0, 6);
    return words.join(' ') + (query.split(' ').length > 6 ? '...' : '');
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId) {
    try {
      const session = await ChatSession.findById(sessionId)
        .populate('course', 'courseName')
        .populate('user', 'first_name last_name');

      if (!session) {
        throw new Error('Chat session not found');
      }

      return session;
    } catch (error) {
      console.error('❌ Error getting chat history:', error);
      throw error;
    }
  }

  /**
   * Get user's chat sessions
   */
  async getUserChatSessions(userId, options = {}) {
    try {
      const { courseId, limit = 20, isActive = true } = options;

      const query = { user: userId, isActive };
      if (courseId) {
        query.course = courseId;
      }

      const sessions = await ChatSession.find(query)
        .populate('course', 'courseName')
        .sort({ 'metadata.lastActivity': -1 })
        .limit(limit);

      return sessions;
    } catch (error) {
      console.error('❌ Error getting user chat sessions:', error);
      throw error;
    }
  }

  /**
   * Search across all course materials
   */
  async searchCourseMaterials(query, options = {}) {
    try {
      const { courseId, documentType, limit = 10 } = options;

      const searchOptions = { nResults: limit };
      
      if (courseId) {
        searchOptions.where = { courseId };
      }
      
      if (documentType) {
        searchOptions.where = { ...searchOptions.where, documentType };
      }

      const results = await vectorStore.semanticSearch(query, searchOptions);
      return await this.enhanceSearchResults(results);
    } catch (error) {
      console.error('❌ Error searching course materials:', error);
      throw error;
    }
  }
}

module.exports = new RAGService();