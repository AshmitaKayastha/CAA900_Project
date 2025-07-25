const { ChromaClient } = require('chromadb');
const ragConfig = require('../config/ragConfig');

class VectorStore {
  constructor() {
    this.config = ragConfig.getConfig();
    this.client = null;
    this.collection = null;
    this.isInitialized = false;
  }

  /**
   * Initialize ChromaDB client and collection
   */
  async initialize() {
    try {
      // Initialize ChromaDB client
      this.client = new ChromaClient({
        path: this.config.vectorDB.chroma.path
      });

      // Get or create collection
      try {
        this.collection = await this.client.getCollection({
          name: this.config.vectorDB.chroma.collectionName
        });
      } catch (error) {
        // Collection doesn't exist, create it
        this.collection = await this.client.createCollection({
          name: this.config.vectorDB.chroma.collectionName,
          metadata: {
            description: "E-learning course documents and materials",
            created_at: new Date().toISOString()
          }
        });
      }

      this.isInitialized = true;
      console.log('✅ Vector store initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing vector store:', error);
      throw error;
    }
  }

  /**
   * Ensure vector store is initialized
   */
  async ensureInitialized() {
    if (!this.isInitialized) {
      await this.initialize();
    }
  }

  /**
   * Add document chunks to vector store
   */
  async addDocumentChunks(documentId, chunks, metadata = {}) {
    try {
      await this.ensureInitialized();

      const ids = [];
      const embeddings = [];
      const documents = [];
      const metadatas = [];

      for (const chunk of chunks) {
        if (chunk.embedding) {
          const chunkId = `${documentId}_${chunk.chunkId}`;
          
          ids.push(chunkId);
          embeddings.push(chunk.embedding);
          documents.push(chunk.content);
          metadatas.push({
            documentId: documentId,
            chunkId: chunk.chunkId,
            chunkNumber: chunk.metadata.chunkNumber,
            startIndex: chunk.metadata.startIndex,
            endIndex: chunk.metadata.endIndex,
            ...metadata
          });
        }
      }

      if (ids.length > 0) {
        await this.collection.add({
          ids: ids,
          embeddings: embeddings,
          documents: documents,
          metadatas: metadatas
        });

        console.log(`✅ Added ${ids.length} chunks to vector store for document ${documentId}`);
        return { success: true, addedChunks: ids.length };
      } else {
        console.warn(`⚠️ No valid embeddings found for document ${documentId}`);
        return { success: false, error: 'No valid embeddings' };
      }
    } catch (error) {
      console.error('❌ Error adding document chunks to vector store:', error);
      throw error;
    }
  }

  /**
   * Search for similar chunks using query embedding
   */
  async searchSimilarChunks(queryEmbedding, options = {}) {
    try {
      await this.ensureInitialized();

      const {
        nResults = this.config.maxRetrievedChunks,
        where = {},
        includeMetadata = true,
        includeDocuments = true,
        includeDistances = true
      } = options;

      const results = await this.collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: nResults,
        where: where,
        include: [
          ...(includeMetadata ? ['metadatas'] : []),
          ...(includeDocuments ? ['documents'] : []),
          ...(includeDistances ? ['distances'] : [])
        ]
      });

      // Transform results into a more usable format
      const formattedResults = [];
      
      if (results.ids && results.ids[0]) {
        for (let i = 0; i < results.ids[0].length; i++) {
          const result = {
            id: results.ids[0][i],
            content: includeDocuments ? results.documents[0][i] : null,
            metadata: includeMetadata ? results.metadatas[0][i] : null,
            distance: includeDistances ? results.distances[0][i] : null,
            similarity: includeDistances ? 1 - results.distances[0][i] : null
          };

          // Only include results above similarity threshold
          if (!includeDistances || result.similarity >= this.config.similarityThreshold) {
            formattedResults.push(result);
          }
        }
      }

      return formattedResults;
    } catch (error) {
      console.error('❌ Error searching similar chunks:', error);
      throw error;
    }
  }

  /**
   * Search for chunks by course ID
   */
  async searchByCourse(queryEmbedding, courseId, options = {}) {
    return this.searchSimilarChunks(queryEmbedding, {
      ...options,
      where: { courseId: courseId }
    });
  }

  /**
   * Search for chunks by document type
   */
  async searchByDocumentType(queryEmbedding, documentType, options = {}) {
    return this.searchSimilarChunks(queryEmbedding, {
      ...options,
      where: { documentType: documentType }
    });
  }

  /**
   * Delete document chunks from vector store
   */
  async deleteDocumentChunks(documentId) {
    try {
      await this.ensureInitialized();

      // Get all chunk IDs for this document
      const results = await this.collection.get({
        where: { documentId: documentId }
      });

      if (results.ids && results.ids.length > 0) {
        await this.collection.delete({
          ids: results.ids
        });

        console.log(`✅ Deleted ${results.ids.length} chunks for document ${documentId}`);
        return { success: true, deletedChunks: results.ids.length };
      } else {
        console.log(`ℹ️ No chunks found for document ${documentId}`);
        return { success: true, deletedChunks: 0 };
      }
    } catch (error) {
      console.error('❌ Error deleting document chunks:', error);
      throw error;
    }
  }

  /**
   * Update document chunks in vector store
   */
  async updateDocumentChunks(documentId, chunks, metadata = {}) {
    try {
      // First delete existing chunks
      await this.deleteDocumentChunks(documentId);
      
      // Then add new chunks
      return await this.addDocumentChunks(documentId, chunks, metadata);
    } catch (error) {
      console.error('❌ Error updating document chunks:', error);
      throw error;
    }
  }

  /**
   * Get collection statistics
   */
  async getStats() {
    try {
      await this.ensureInitialized();

      const count = await this.collection.count();
      
      return {
        totalChunks: count,
        collectionName: this.config.vectorDB.chroma.collectionName,
        isInitialized: this.isInitialized
      };
    } catch (error) {
      console.error('❌ Error getting vector store stats:', error);
      throw error;
    }
  }

  /**
   * Perform semantic search with text query
   */
  async semanticSearch(query, options = {}) {
    try {
      // Generate embedding for the query
      const queryEmbedding = await ragConfig.generateEmbedding(query);
      
      // Search for similar chunks
      return await this.searchSimilarChunks(queryEmbedding, options);
    } catch (error) {
      console.error('❌ Error performing semantic search:', error);
      throw error;
    }
  }
}

module.exports = new VectorStore();