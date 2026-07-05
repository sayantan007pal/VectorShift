// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      
      const data = await response.json();
      
      alert(
        `Pipeline Analysis:\n` +
        `Nodes: ${data.num_nodes}\n` +
        `Edges: ${data.num_edges}\n` +
        `Is DAG: ${data.is_dag ? 'Yes' : 'No (has cycles)'}`
      );
    } catch (err) {
      alert('Error: Could not connect to backend. Make sure server is running.');
    }
    
    setLoading(false);
  };

  return (
    <div className="submit-container">
      <button 
        className="submit-btn" 
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Checking...' : 'Submit Pipeline'}
      </button>
    </div>
  );
}
