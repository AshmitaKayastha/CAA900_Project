import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocumentUpload.css';

const DocumentUpload = ({ courseId, onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState('pdf');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE = process.env.REACT_APP_API || 'http://localhost:5001';

  useEffect(() => {
    if (courseId) {
      loadDocuments();
    }
  }, [courseId]);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      const response = await axios.get(
        `${API_BASE}/api/rag/documents?courseId=${courseId}`,
        config
      );

      setDocuments(response.data.data);
    } catch (error) {
      console.error('Error loading documents:', error);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
      
      // Auto-detect document type based on file extension
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension === 'pdf') setDocumentType('pdf');
      else if (extension === 'docx' || extension === 'doc') setDocumentType('docx');
      else if (extension === 'txt') setDocumentType('txt');
      else setDocumentType('pdf'); // default
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseId) {
      setError('Please select a file and ensure course is selected');
      return;
    }

    setIsUploading(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('courseId', courseId);
      formData.append('title', title || selectedFile.name);
      formData.append('documentType', documentType);

      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        }
      };

      const response = await axios.post(
        `${API_BASE}/api/rag/upload-document`,
        formData,
        config
      );

      setSuccess('Document uploaded successfully! Processing in background...');
      setSelectedFile(null);
      setTitle('');
      setUploadProgress(0);
      
      // Reload documents list
      setTimeout(() => {
        loadDocuments();
      }, 1000);

      if (onUploadComplete) {
        onUploadComplete(response.data.documentId);
      }

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 5000);

    } catch (error) {
      console.error('Upload error:', error);
      setError(error.response?.data?.error || 'Upload failed');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      };

      await axios.delete(
        `${API_BASE}/api/rag/document/${documentId}`,
        config
      );

      setSuccess('Document deleted successfully');
      loadDocuments();

      setTimeout(() => {
        setSuccess(null);
      }, 3000);

    } catch (error) {
      console.error('Delete error:', error);
      setError(error.response?.data?.error || 'Delete failed');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending' },
      processing: { class: 'badge-info', text: 'Processing' },
      completed: { class: 'badge-success', text: 'Completed' },
      failed: { class: 'badge-danger', text: 'Failed' }
    };

    const badge = badges[status] || badges.pending;
    return (
      <span className={`badge ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="document-upload-container">
      <div className="upload-section">
        <h4>📁 Upload Course Materials</h4>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        )}

        <div className="upload-form">
          <div className="form-group">
            <label htmlFor="file-input" className="file-input-label">
              <div className="file-input-area">
                {selectedFile ? (
                  <div className="file-selected">
                    <span className="file-icon">📄</span>
                    <div className="file-info">
                      <div className="file-name">{selectedFile.name}</div>
                      <div className="file-size">{formatFileSize(selectedFile.size)}</div>
                    </div>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <span className="upload-icon">📤</span>
                    <div>Click to select file or drag and drop</div>
                    <small>Supported: PDF, DOC, DOCX, TXT (Max 50MB)</small>
                  </div>
                )}
              </div>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={isUploading}
            />
          </div>

          {selectedFile && (
            <>
              <div className="form-group">
                <label htmlFor="title">Document Title:</label>
                <input
                  id="title"
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter document title"
                  disabled={isUploading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="document-type">Document Type:</label>
                <select
                  id="document-type"
                  className="form-control"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  disabled={isUploading}
                >
                  <option value="pdf">PDF Document</option>
                  <option value="slides">Presentation Slides</option>
                  <option value="text">Text Document</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>

              {isUploading && (
                <div className="upload-progress">
                  <div className="progress">
                    <div
                      className="progress-bar"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {uploadProgress}%
                    </div>
                  </div>
                  <small>Uploading and processing document...</small>
                </div>
              )}

              <button
                className="btn btn-primary upload-btn"
                onClick={handleUpload}
                disabled={isUploading || !selectedFile}
              >
                {isUploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm" />
                    Uploading...
                  </>
                ) : (
                  <>
                    📤 Upload Document
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Documents List */}
      <div className="documents-section">
        <h5>📚 Course Documents ({documents.length})</h5>
        
        {documents.length === 0 ? (
          <div className="no-documents">
            <p>No documents uploaded yet. Upload some course materials to get started with AI assistance!</p>
          </div>
        ) : (
          <div className="documents-list">
            {documents.map((doc) => (
              <div key={doc._id} className="document-item">
                <div className="document-header">
                  <div className="document-info">
                    <h6 className="document-title">{doc.title}</h6>
                    <div className="document-meta">
                      <span className="document-type">{doc.documentType}</span>
                      {getStatusBadge(doc.processingStatus)}
                      <span className="document-date">
                        {formatDate(doc.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(doc._id)}
                      title="Delete document"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {doc.isProcessed && (
                  <div className="document-stats">
                    <small>
                      📊 {doc.chunks?.length || 0} chunks processed
                      {doc.chunks?.length > 0 && (
                        <span> • Ready for AI assistance</span>
                      )}
                    </small>
                  </div>
                )}

                {doc.processingStatus === 'failed' && (
                  <div className="document-error">
                    <small className="text-danger">
                      ❌ Processing failed. Please try uploading again.
                    </small>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload;