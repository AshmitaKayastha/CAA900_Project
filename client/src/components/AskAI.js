import React, { useState } from 'react';

function AskAI({ courseId }) {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, query }),
      });
      const data = await res.json();
      setResponse(data.answer);
    } catch (err) {
      setResponse("Failed to get response from AI.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>Ask about this course</h3>
      <input
        type="text"
        placeholder="Type your question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '60%', padding: '8px' }}
      />
      <button onClick={handleAsk} style={{ padding: '8px 16px', marginLeft: '10px' }}>
        Ask
      </button>
      {loading && <p>Loading...</p>}
      {response && (
        <div style={{ marginTop: '10px', background: '#f1f1f1', padding: '10px' }}>
          <strong>Answer:</strong> {response}
        </div>
      )}
    </div>
  );
}

export default AskAI;
