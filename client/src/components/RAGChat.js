import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './RAGChat.css';

const RAGChat = ({ courseId = null, userId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [showSources, setShowSources] = useState({});
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const API_BASE = process.env.REACT_APP_API || 'http://localhost:5001';

  useEffect(() => {
    loadChatSessions();
  }, [courseId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadChatSessions = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(
        `${API_BASE}/api/rag/chat-sessions${courseId ? `?courseId=${courseId}` : ''}`,
        config
      );

      setChatSessions(response.data.data);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadChatHistory = async (sessionId) => {
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(
        `${API_BASE}/api/rag/chat-history/${sessionId}`,
        config
      );

      const session = response.data.data;
      setMessages(session.messages);
      setSessionId(sessionId);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      const requestData = {
        query: inputMessage,
        courseId: courseId,
        sessionId: sessionId,
        sessionType: courseId ? 'course_specific' : 'general'
      };

      const response = await axios.post(
        `${API_BASE}/api/rag/chat`,
        requestData,
        config
      );

      const result = response.data.data;
      
      const assistantMessage = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        sources: result.sources,
        metadata: result.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
      setSessionId(result.sessionId);
      
      // Reload sessions to include new session
      if (!sessionId) {
        loadChatSessions();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleSources = (messageIndex) => {
    setShowSources(prev => ({
      ...prev,
      [messageIndex]: !prev[messageIndex]
    }));
  };

  const startNewChat = () => {
    setMessages([]);
    setSessionId(null);
    setError(null);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="rag-chat-container">
      <div className="chat-header">
        <h3>
          {courseId ? 'Course Assistant' : 'AI Learning Assistant'}
        </h3>
        <div className="chat-controls">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={startNewChat}
          >
            New Chat
          </button>
        </div>
      </div>

      {/* Chat Sessions Sidebar */}
      {chatSessions.length > 0 && (
        <div className="chat-sessions">
          <h5>Recent Conversations</h5>
          <div className="sessions-list">
            {chatSessions.slice(0, 5).map((session) => (
              <div
                key={session._id}
                className={`session-item ${sessionId === session._id ? 'active' : ''}`}
                onClick={() => loadChatHistory(session._id)}
              >
                <div className="session-title">{session.sessionTitle}</div>
                <div className="session-meta">
                  {session.course?.courseName} • {session.metadata.totalMessages} messages
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Messages Area */}
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <h4>👋 Welcome to your AI Learning Assistant!</h4>
            <p>
              {courseId 
                ? 'Ask me anything about this course. I can help you understand concepts, explain materials, and answer questions based on the course content.'
                : 'I can help you with your learning journey. Ask me questions about any topic, and I\'ll do my best to provide helpful explanations.'
              }
            </p>
            <div className="example-questions">
              <p><strong>Try asking:</strong></p>
              <ul>
                <li>"Can you explain the main concepts from the last lecture?"</li>
                <li>"What are the key points I should remember for the exam?"</li>
                <li>"Help me understand this assignment"</li>
              </ul>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.role} ${message.isError ? 'error' : ''}`}
          >
            <div className="message-content">
              <div className="message-text">
                {message.content}
              </div>
              
              {/* Sources */}
              {message.sources && message.sources.length > 0 && (
                <div className="message-sources">
                  <button
                    className="sources-toggle"
                    onClick={() => toggleSources(index)}
                  >
                    📚 {message.sources.length} source{message.sources.length > 1 ? 's' : ''}
                    {showSources[index] ? ' ▼' : ' ▶'}
                  </button>
                  
                  {showSources[index] && (
                    <div className="sources-list">
                      {message.sources.map((source, sourceIndex) => (
                        <div key={sourceIndex} className="source-item">
                          <div className="source-header">
                            <strong>{source.title}</strong>
                            <span className="source-type">{source.type}</span>
                            {source.relevanceScore && (
                              <span className="relevance-score">
                                {Math.round(source.relevanceScore * 100)}% match
                              </span>
                            )}
                          </div>
                          {source.courseName && (
                            <div className="source-course">{source.courseName}</div>
                          )}
                          <div className="source-excerpt">{source.excerpt}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Metadata */}
              {message.metadata && (
                <div className="message-metadata">
                  <small>
                    {message.metadata.retrievedChunks} chunks • 
                    {message.metadata.processingTime}ms • 
                    ~{message.metadata.totalTokens} tokens
                  </small>
                </div>
              )}
            </div>
            
            <div className="message-timestamp">
              {formatTimestamp(message.timestamp)}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant loading">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="input-container">
        <div className="input-group">
          <textarea
            className="form-control"
            placeholder="Ask me anything about your course..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            rows="2"
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
            >
              {isLoading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                '📤'
              )}
            </button>
          </div>
        </div>
        
        <div className="input-help">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default RAGChat;