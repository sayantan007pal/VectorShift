# VectorShift Frontend Technical Assessment - Documentation

## Project Overview

A **Visual Pipeline Builder** using React + ReactFlow for the frontend and FastAPI for the backend.

**Tech Stack:**
- Frontend: React 18, ReactFlow 11.8, Zustand
- Backend: Python, FastAPI, Uvicorn

---

## Current Codebase Structure

```
frontend/src/
├── App.js              # Root - renders Toolbar, Canvas, Submit
├── store.js            # Zustand store (nodes[], edges[], actions)
├── ui.js               # ReactFlow canvas with drag-drop
├── toolbar.js          # Draggable node buttons
├── draggableNode.js    # HTML5 drag-drop wrapper
├── submit.js           # Submit button (currently non-functional)
└── nodes/
    ├── inputNode.js    # Input node
    ├── llmNode.js      # LLM node  
    ├── outputNode.js   # Output node
    └── textNode.js     # Text node

backend/
└── main.py             # FastAPI server (stub)
```

---

## Assessment Requirements Summary

| Part | Goal | Key Implementation |
|------|------|-------------------|
| **1** | Node Abstraction | Create reusable `BaseNode` component |
| **2** | Styling | Apply consistent dark theme styling |
| **3** | Text Node | Dynamic handles for `{{variables}}` |
| **4** | Backend | DAG validation with Kahn's algorithm |

---

## Part 1: Node Abstraction

### Goal
Eliminate code duplication by creating a configurable `BaseNode` component.

### Architecture

```
BaseNode (receives config)
    │
    ├── Renders: Header (title)
    ├── Renders: Body (fields)
    └── Renders: Handles (inputs/outputs)
```

### Minimal Config Structure

```javascript
// A node config only needs these fields:
{
  type: 'customInput',       // Required: node type identifier
  title: 'Input',            // Required: display title
  handles: [                 // Required: array of handles
    { id: 'value', type: 'source', position: 'Right' }
  ],
  fields: [                  // Required: array of form fields
    { name: 'inputName', label: 'Name', type: 'text', defaultValue: '' },
    { name: 'inputType', label: 'Type', type: 'select', defaultValue: 'Text', 
      options: ['Text', 'File'] }
  ]
}
```

### BaseNode Component

**File: `/src/components/BaseNode.js`**

```javascript
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionMap = {
  Left: Position.Left,
  Right: Position.Right,
  Top: Position.Top,
  Bottom: Position.Bottom,
};

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChange = (fieldName, value) => {
    updateNodeField(id, fieldName, value);
  };

  // Render field based on type
  const renderField = (field) => {
    const value = data[field.name] ?? field.defaultValue;

    if (field.type === 'select') {
      return (
        <select
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
        >
          {field.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={(e) => handleChange(field.name, e.target.value)}
        />
      );
    }

    // Default: text input
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(field.name, e.target.value)}
      />
    );
  };

  return (
    <div className="base-node">
      <div className="node-header">{config.title}</div>
      <div className="node-body">
        {config.fields.map((field) => (
          <div key={field.name} className="field">
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
      </div>
      
      {/* Render handles */}
      {config.handles.map((handle) => (
        <Handle
          key={handle.id}
          id={`${id}-${handle.id}`}
          type={handle.type}
          position={positionMap[handle.position]}
        />
      ))}
    </div>
  );
};
```

### Node Configurations

**File: `/src/nodes/nodeConfigs.js`**

```javascript
// ============ EXISTING 4 NODES ============

export const inputNodeConfig = {
  type: 'customInput',
  title: 'Input',
  handles: [
    { id: 'value', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'inputName', label: 'Name', type: 'text', defaultValue: '' },
    { name: 'inputType', label: 'Type', type: 'select', defaultValue: 'Text', 
      options: ['Text', 'File'] }
  ]
};

export const outputNodeConfig = {
  type: 'customOutput',
  title: 'Output',
  handles: [
    { id: 'value', type: 'target', position: 'Left' }
  ],
  fields: [
    { name: 'outputName', label: 'Name', type: 'text', defaultValue: '' },
    { name: 'outputType', label: 'Type', type: 'select', defaultValue: 'Text', 
      options: ['Text', 'Image'] }
  ]
};

export const llmNodeConfig = {
  type: 'llm',
  title: 'LLM',
  handles: [
    { id: 'system', type: 'target', position: 'Left' },
    { id: 'prompt', type: 'target', position: 'Left' },
    { id: 'response', type: 'source', position: 'Right' }
  ],
  fields: [] // LLM node has no editable fields - just displays info
};

export const textNodeConfig = {
  type: 'text',
  title: 'Text',
  handles: [
    { id: 'output', type: 'source', position: 'Right' }
    // Dynamic handles added by TextNode component
  ],
  fields: [
    { name: 'text', label: 'Text', type: 'textarea', defaultValue: '{{input}}' }
  ]
};

// ============ 5 NEW DEMO NODES ============

export const noteNodeConfig = {
  type: 'note',
  title: 'Note',
  handles: [], // No handles - just a sticky note
  fields: [
    { name: 'content', label: 'Note', type: 'textarea', defaultValue: '' }
  ]
};

export const mathNodeConfig = {
  type: 'math',
  title: 'Math',
  handles: [
    { id: 'a', type: 'target', position: 'Left' },
    { id: 'b', type: 'target', position: 'Left' },
    { id: 'result', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'operation', label: 'Operation', type: 'select', defaultValue: 'add',
      options: ['add', 'subtract', 'multiply', 'divide'] }
  ]
};

export const timerNodeConfig = {
  type: 'timer',
  title: 'Timer',
  handles: [
    { id: 'trigger', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'interval', label: 'Interval (ms)', type: 'text', defaultValue: '1000' }
  ]
};

export const loggerNodeConfig = {
  type: 'logger',
  title: 'Logger',
  handles: [
    { id: 'input', type: 'target', position: 'Left' }
  ],
  fields: [
    { name: 'prefix', label: 'Prefix', type: 'text', defaultValue: '[LOG]' }
  ]
};

export const joinNodeConfig = {
  type: 'join',
  title: 'Join',
  handles: [
    { id: 'input1', type: 'target', position: 'Left' },
    { id: 'input2', type: 'target', position: 'Left' },
    { id: 'output', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'separator', label: 'Separator', type: 'text', defaultValue: ', ' }
  ]
};

// Registry for easy access
export const nodeConfigs = {
  customInput: inputNodeConfig,
  customOutput: outputNodeConfig,
  llm: llmNodeConfig,
  text: textNodeConfig,
  note: noteNodeConfig,
  math: mathNodeConfig,
  timer: timerNodeConfig,
  logger: loggerNodeConfig,
  join: joinNodeConfig,
};
```

### Factory Function

**File: `/src/nodes/createNode.js`**

```javascript
import { BaseNode } from '../components/BaseNode';

// Create a node component from config
export const createNodeFromConfig = (config) => {
  const NodeComponent = (props) => <BaseNode {...props} config={config} />;
  NodeComponent.displayName = `${config.title}Node`;
  return NodeComponent;
};
```

### Usage in ui.js

```javascript
import { nodeConfigs } from './nodes/nodeConfigs';
import { createNodeFromConfig } from './nodes/createNode';
import TextNode from './nodes/TextNode'; // Special handling

// Generate nodeTypes
const nodeTypes = {};
Object.entries(nodeConfigs).forEach(([type, config]) => {
  if (type === 'text') {
    nodeTypes[type] = TextNode; // TextNode has special dynamic handle logic
  } else {
    nodeTypes[type] = createNodeFromConfig(config);
  }
});
```

---

## Part 2: Styling

### Goal
Apply a consistent dark theme across all components.

### CSS Variables (Design Tokens)

**File: `/src/index.css`** (add to existing)

```css
:root {
  /* Colors */
  --bg-canvas: #0f172a;
  --bg-surface: #1e293b;
  --bg-elevated: #334155;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --border-default: #334155;
  --border-focus: #6366f1;
  --accent: #6366f1;
  --success: #10b981;
  --warning: #f59e0b;
  
  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-mono: 'Fira Code', monospace;
}
```

### Node Styles

```css
.base-node {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 8px;
  min-width: 200px;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.base-node.selected {
  border-color: var(--accent);
  box-shadow: 0 0 0 2px var(--accent);
}

.node-header {
  background: var(--accent);
  padding: var(--space-sm) var(--space-md);
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  border-radius: 8px 8px 0 0;
}

.node-body {
  padding: var(--space-md);
}

.field {
  margin-bottom: var(--space-sm);
}

.field label {
  display: block;
  font-size: 10px;
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
  text-transform: uppercase;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: var(--space-sm);
  background: var(--bg-canvas);
  border: 1px solid var(--border-default);
  border-radius: 4px;
  color: var(--text-primary);
  font-size: 12px;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--accent);
}
```

### Toolbar Styles

```css
.toolbar {
  background: var(--bg-canvas);
  border-bottom: 1px solid var(--border-default);
  padding: var(--space-lg);
  display: flex;
  gap: var(--space-md);
}

.draggable-node {
  background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: 6px;
  padding: var(--space-sm) var(--space-md);
  cursor: grab;
  font-size: 12px;
  color: var(--text-primary);
}

.draggable-node:hover {
  background: var(--bg-elevated);
  border-color: var(--accent);
}
```

### Submit Button Styles

```css
.submit-btn {
  background: var(--accent);
  color: white;
  border: none;
  border-radius: 6px;
  padding: var(--space-md) var(--space-lg);
  font-weight: 600;
  cursor: pointer;
}

.submit-btn:hover {
  filter: brightness(1.1);
}
```

---

## Part 3: Text Node with Dynamic Handles

### Goal
1. Auto-resize textarea based on content
2. Parse `{{variableName}}` and create input handles for each

### Variable Parsing

**File: `/src/utils/variableParser.js`**

```javascript
/**
 * Extract variable names from text containing {{variable}} patterns
 * @param {string} text - Input text
 * @returns {string[]} - Array of unique variable names
 */
export const parseVariables = (text) => {
  if (!text) return [];
  
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
};
```

### TextNode Component

**File: `/src/nodes/TextNode.js`**

```javascript
import { useState, useEffect, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';
import { parseVariables } from '../utils/variableParser';

const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);

  // Parse variables when text changes
  useEffect(() => {
    const parsed = parseVariables(text);
    setVariables(parsed);
    updateNodeField(id, 'text', text);
    
    // CRITICAL: Tell ReactFlow handles have changed
    updateNodeInternals(id);
  }, [text, id, updateNodeField, updateNodeInternals]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [text]);

  return (
    <div className="base-node text-node">
      <div className="node-header">Text</div>
      <div className="node-body">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text with {{variables}}"
        />
        
        {variables.length > 0 && (
          <div className="variables-preview">
            Variables: {variables.join(', ')}
          </div>
        )}
      </div>

      {/* Dynamic input handles for each variable */}
      {variables.map((varName, index) => {
        const offset = ((index + 1) / (variables.length + 1)) * 100;
        return (
          <Handle
            key={varName}
            id={`${id}-${varName}`}
            type="target"
            position={Position.Left}
            style={{ top: `${offset}%` }}
          />
        );
      })}

      {/* Output handle */}
      <Handle
        id={`${id}-output`}
        type="source"
        position={Position.Right}
      />
    </div>
  );
};

export default TextNode;
```

### Key Points
1. **`useUpdateNodeInternals(id)`** - Must be called after handles change, otherwise edges won't connect properly
2. **Handle positioning** - Distribute handles evenly using percentage offset
3. **Auto-resize** - Set height to `scrollHeight` after each change

---

## Part 4: Backend Integration

### Goal
Send pipeline data to backend, validate it's a DAG, return stats.

### Backend Implementation

**File: `/backend/main.py`**

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from collections import deque

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class Position(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    id: str
    class Config:
        extra = "allow"  # Allow any additional fields

class Node(BaseModel):
    id: str
    type: str
    position: Position
    data: NodeData

class Edge(BaseModel):
    id: str
    source: str
    target: str
    sourceHandle: Optional[str] = None
    targetHandle: Optional[str] = None

class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]

class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if graph is a DAG using Kahn's algorithm (topological sort).
    Returns True if no cycles exist.
    """
    if not nodes:
        return True
    
    # Build adjacency list and in-degree count
    node_ids = {n.id for n in nodes}
    in_degree = {nid: 0 for nid in node_ids}
    adj = {nid: [] for nid in node_ids}
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Start with nodes that have no incoming edges
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    processed = 0
    
    while queue:
        node = queue.popleft()
        processed += 1
        
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we processed all nodes, it's a DAG
    return processed == len(nodes)


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/pipelines/parse", response_model=PipelineResponse)
def parse_pipeline(pipeline: PipelineRequest):
    return PipelineResponse(
        num_nodes=len(pipeline.nodes),
        num_edges=len(pipeline.edges),
        is_dag=is_dag(pipeline.nodes, pipeline.edges)
    )
```

### Frontend Submit

**File: `/src/submit.js`**

```javascript
import { useStore } from './store';

export const SubmitButton = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      
      const data = await response.json();
      
      alert(
        `Pipeline Analysis:\n` +
        `- Nodes: ${data.num_nodes}\n` +
        `- Edges: ${data.num_edges}\n` +
        `- Valid DAG: ${data.is_dag ? 'Yes ✓' : 'No ✗ (has cycles)'}`
      );
    } catch (error) {
      alert('Error: Could not connect to backend');
    }
  };

  return (
    <button className="submit-btn" onClick={handleSubmit}>
      Submit Pipeline
    </button>
  );
};
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                            │
│                                                         │
│  Toolbar ──drag──> Canvas ──drop──> store.addNode()    │
│                           │                              │
│  Connect nodes ─────────> store.onConnect()            │
│                           │                              │
│  Submit button ─────────> fetch('/pipelines/parse')    │
│                           │                              │
└───────────────────────────┼─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                             │
│                                                         │
│  POST /pipelines/parse                                  │
│    │                                                    │
│    ├─> Count nodes                                      │
│    ├─> Count edges                                      │
│    └─> Kahn's algorithm (DAG check)                    │
│    │                                                    │
│    └─> Return { num_nodes, num_edges, is_dag }         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## API Contract

### POST /pipelines/parse

**Request:**
```json
{
  "nodes": [
    { "id": "input-1", "type": "customInput", "position": {"x": 100, "y": 100}, 
      "data": {"id": "input-1", "inputName": "test"} }
  ],
  "edges": [
    { "id": "e1", "source": "input-1", "target": "output-1" }
  ]
}
```

**Response:**
```json
{
  "num_nodes": 1,
  "num_edges": 1,
  "is_dag": true
}
```

---

## File Structure (After Implementation)

```
frontend/src/
├── components/
│   └── BaseNode.js          # Reusable node component
├── nodes/
│   ├── nodeConfigs.js       # All node configurations
│   ├── createNode.js        # Factory function
│   └── TextNode.js          # Special text node
├── utils/
│   └── variableParser.js    # {{variable}} parsing
├── App.js
├── store.js
├── ui.js
├── toolbar.js
├── submit.js
└── index.css                # Styles + CSS variables

backend/
└── main.py                  # Complete FastAPI server
```

---

## Quick Reference

### Node Config Schema
```javascript
{
  type: string,              // Node type ID
  title: string,             // Display title
  handles: [{
    id: string,              // Handle ID
    type: 'source' | 'target',
    position: 'Left' | 'Right' | 'Top' | 'Bottom'
  }],
  fields: [{
    name: string,            // Field key in data
    label: string,           // Display label
    type: 'text' | 'select' | 'textarea',
    defaultValue: any,
    options?: string[]       // For select only
  }]
}
```

### DAG Algorithm (Kahn's)
1. Count in-degrees for all nodes
2. Add nodes with in-degree 0 to queue
3. Process queue: remove node, decrement neighbor in-degrees
4. If processed count equals total nodes → DAG (no cycles)

**Time:** O(V + E) | **Space:** O(V + E)
