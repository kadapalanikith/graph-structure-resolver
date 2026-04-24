import React, { useState } from 'react';
import axios from 'axios';
import './index.css';

const TreeNode = ({ name, children }) => {
  const childKeys = Object.keys(children);
  return (
    <div className="tree-node">
      <div className="tree-node-content">
        <span className="node-label">{name}</span>
      </div>
      {childKeys.length > 0 && (
        <div className="tree-children">
          {childKeys.map(key => (
            <TreeNode key={key} name={key} children={children[key]} />
          ))}
        </div>
      )}
    </div>
  );
};

function App() {
  const [input, setInput] = useState('[\n  "A->B",\n  "A->C",\n  "B->D",\n  "C->E",\n  "E->F",\n  "X->Y",\n  "Y->Z",\n  "Z->X",\n  "P->Q",\n  "Q->R",\n  "G->H",\n  "G->H",\n  "G->I",\n  "hello",\n  "1->2",\n  "A->"\n]');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setLoading(true);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(input);
        if (!Array.isArray(parsedData)) {
          throw new Error('Input must be a JSON array of strings');
        }
      } catch (err) {
        throw new Error('Invalid JSON format: ' + err.message);
      }

      // Allow configuring API URL via env, fallback to localhost for dev
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/bfhl';
      
      const res = await axios.post(apiUrl, { data: parsedData });
      setResponse(res.data);
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || 'Server Error');
      } else {
        setError(err.message || 'Network Error. Make sure the backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="title">BFHL Hierarchy Processor</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="dataInput" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Enter JSON Array of Nodes:
          </label>
          <textarea
            id="dataInput"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='e.g. ["A->B", "A->C"]'
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Process Hierarchies'}
        </button>
      </form>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="response-section">
          <h2 className="response-title">Analysis Results</h2>
          
          <div className="section">
             <h3>User Info</h3>
             <pre style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
User ID: {response.user_id}
Email: {response.email_id}
Roll Number: {response.college_roll_number}
             </pre>
          </div>

          <div className="section">
            <h3>Summary</h3>
            <pre>{JSON.stringify(response.summary, null, 2)}</pre>
          </div>

          <div className="section">
            <h3>Hierarchies</h3>
            {response.hierarchies.length === 0 && <p>No valid hierarchies found.</p>}
            {response.hierarchies.map((hierarchy, index) => (
              <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#fafafa' }}>
                <p style={{ margin: '0 0 0.5rem 0' }}><strong>Root:</strong> <span className="node-label">{hierarchy.root}</span></p>
                {hierarchy.has_cycle ? (
                  <p style={{ color: '#ef4444', margin: 0 }}><strong>⚠️ Cycle Detected</strong></p>
                ) : (
                  <>
                    <p style={{ margin: '0 0 1rem 0' }}><strong>Depth:</strong> {hierarchy.depth}</p>
                    <div className="tree-container">
                      {Object.keys(hierarchy.tree).map(key => (
                        <TreeNode key={key} name={key} children={hierarchy.tree[key]} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="section">
            <h3>Invalid Entries</h3>
            {response.invalid_entries.length > 0 ? (
              <pre style={{ color: '#991b1b', backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
                {JSON.stringify(response.invalid_entries, null, 2)}
              </pre>
            ) : (
              <p>No invalid entries.</p>
            )}
          </div>

          <div className="section">
            <h3>Duplicate Edges</h3>
            {response.duplicate_edges.length > 0 ? (
              <pre style={{ color: '#9a3412', backgroundColor: '#fff7ed', borderColor: '#fed7aa' }}>
                {JSON.stringify(response.duplicate_edges, null, 2)}
              </pre>
            ) : (
              <p>No duplicate edges.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
