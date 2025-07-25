require('dotenv').config();
const { OpenAI } = require('openai');
const { AzureOpenAI } = require('@azure/openai');

class RAGConfig {
  constructor() {
    this.useAzure = process.env.USE_AZURE_OPENAI === 'true';
    this.initializeClients();
  }

  initializeClients() {
    if (this.useAzure) {
      // Azure OpenAI Configuration
      this.client = new AzureOpenAI({
        endpoint: process.env.AZURE_OPENAI_ENDPOINT,
        apiKey: process.env.AZURE_OPENAI_API_KEY,
        apiVersion: "2024-02-15-preview"
      });
      this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    } else {
      // Standard OpenAI Configuration
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    }
  }

  getConfig() {
    return {
      // Model Configuration
      chatModel: this.useAzure ? this.deploymentName : (process.env.OPENAI_MODEL || 'gpt-3.5-turbo'),
      embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-ada-002',
      
      // RAG Parameters
      maxContextLength: parseInt(process.env.MAX_CONTEXT_LENGTH) || 4000,
      chunkSize: parseInt(process.env.CHUNK_SIZE) || 1000,
      chunkOverlap: parseInt(process.env.CHUNK_OVERLAP) || 200,
      maxRetrievedChunks: 5,
      similarityThreshold: 0.7,
      
      // Vector Database
      vectorDB: {
        type: process.env.VECTOR_DB_TYPE || 'chroma', // 'pinecone' or 'chroma'
        pinecone: {
          apiKey: process.env.PINECONE_API_KEY,
          environment: process.env.PINECONE_ENVIRONMENT,
          indexName: process.env.PINECONE_INDEX_NAME || 'elearning-rag'
        },
        chroma: {
          path: process.env.CHROMA_DB_PATH || './vector_db',
          collectionName: 'elearning_documents'
        }
      },
      
      // System Prompts
      systemPrompts: {
        general: `You are an intelligent educational assistant for an e-learning platform. 
                 You help students understand course materials, answer questions about lectures, 
                 and provide explanations based on the provided context. Always be helpful, 
                 accurate, and educational in your responses.`,
        
        courseSpecific: `You are a specialized tutor for this specific course. 
                        Use the provided course materials to answer student questions. 
                        If you're unsure about something, clearly state your uncertainty 
                        and suggest consulting the instructor.`,
        
        assignmentHelp: `You are an academic assistant helping with assignments. 
                        Provide guidance and explanations rather than direct answers. 
                        Encourage critical thinking and learning.`
      }
    };
  }

  getClient() {
    return this.client;
  }

  async generateEmbedding(text) {
    try {
      const response = await this.client.embeddings.create({
        model: this.getConfig().embeddingModel,
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw error;
    }
  }

  async generateChatCompletion(messages, options = {}) {
    try {
      const config = this.getConfig();
      const response = await this.client.chat.completions.create({
        model: config.chatModel,
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        top_p: options.topP || 1,
        frequency_penalty: options.frequencyPenalty || 0,
        presence_penalty: options.presencePenalty || 0
      });
      
      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat completion:', error);
      throw error;
    }
  }
}

module.exports = new RAGConfig();