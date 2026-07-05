// textNode.js

import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

// Parse {{variableName}} from text and return unique variable names
function parseVariables(text) {
  if (!text) return [];
  
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const found = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (!found.includes(match[1])) {
      found.push(match[1]);
    }
  }
  
  return found;
}

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState(() => parseVariables(data?.text || '{{input}}'));

  // When text changes, parse variables and update store
  useEffect(() => {
    const newVars = parseVariables(text);
    setVariables(newVars);
    updateNodeField(id, 'text', text);
    updateNodeInternals(id); // tell ReactFlow handles changed
  }, [text, id, updateNodeField, updateNodeInternals]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 150) + 'px';
    }
  }, [text]);

  return (
    <div className="base-node text">
      <div className="node-header">
        <span>Text</span>
      </div>
      <div className="node-body">
        <label>
          <span>Text:</span>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text with {{variables}}"
          />
        </label>
        {variables.length > 0 && (
          <div className="variables-list">
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>

      {/* Dynamic handles for each variable */}
      {variables.map((varName, i) => {
        const offset = ((i + 1) / (variables.length + 1)) * 100;
        return (
          <Handle
            key={varName}
            type="target"
            position={Position.Left}
            id={`${id}-${varName}`}
            style={{ top: `${offset}%` }}
          />
        );
      })}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
}
