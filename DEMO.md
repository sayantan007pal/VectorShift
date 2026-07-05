# Demo Guide

## Setup Instructions

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate   # Mac/Linux
# OR
venv\Scripts\activate      # Windows

# Install dependencies
pip install fastapi uvicorn pydantic python-dotenv

# Setup environment variables
cp .env.example .env
# Edit .env if needed (default is fine for local dev)

# Run server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env if needed (default is fine for local dev)

# Run app
npm start
```

### Environment Variables

**Backend (.env)**
```
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:8000
```

For production, change these to your deployed URLs.

---

## Video Demo (3-5 min)

### 1. Show the UI (30 sec)
- Open browser at localhost:3000
- Point at toolbar with all node types
- Show the dark themed canvas

### 2. Build a Pipeline (1 min)
- Drag **Input** node → name it "query"
- Drag **Text** node → type `Answer this: {{question}}`
- Drag **LLM** node
- Drag **Output** node → name it "response"
- Connect them: Input → Text → LLM → Output

### 3. Show Dynamic Handles (30 sec)
- Click on Text node
- Change text to `Hello {{name}}, your order {{id}} is ready`
- Watch 2 handles appear on left side
- Delete one variable → handle disappears

### 4. Show DAG Validation (1 min)
- Click **Submit** → shows "Is DAG: Yes"
- Create a cycle: drag 3 nodes, connect A→B→C→A
- Click **Submit** → shows "Is DAG: No"
- Delete one edge to break cycle
- Submit again → "Is DAG: Yes"

### 5. Show Different Nodes (30 sec)

**Math Node** - Demonstrates multi-input arithmetic:
- Drag from toolbar to canvas
- Shows 2 input handles (left side) labeled "a" and "b"
- Shows 1 output handle (right side) labeled "result"
- Select operation from dropdown: Add, Subtract, Multiply, Divide
- Use case: "Connect two number outputs, performs calculation, passes result downstream"

**Note Node** - Demonstrates annotation-only nodes:
- Drag to canvas
- Shows NO handles at all (no inputs, no outputs)
- Just a text area for writing comments
- Use case: "For documenting your pipeline - doesn't affect data flow"

**Join Node** - Demonstrates text concatenation:
- Drag to canvas
- Shows 2 input handles: "input1" and "input2"
- Shows 1 output handle: "joined"
- Has a separator field (default: space)
- Use case: "Takes two text inputs, joins them with separator, outputs combined string"

**Quick comparison to show abstraction power:**
```
Node Type    | Inputs | Outputs | Fields
-------------|--------|---------|------------------
Math         | 2      | 1       | operation dropdown
Note         | 0      | 0       | text area
Join         | 2      | 1       | separator input
Text         | dynamic| 1       | textarea (creates handles from {{vars}})
```

---

## Technical Demo (Interview Setting)

### Architecture Overview
```
User drags node → dataTransfer stores type
     ↓
User drops on canvas → ui.js reads type, creates node
     ↓
Node renders via BaseNode + config
     ↓
User edits fields → updateNodeField updates store
     ↓
User connects nodes → edges array updated
     ↓
Submit → POST to backend → Kahn's algo checks for cycles
```

### Code Walkthrough Points

**1. Node Abstraction (show nodeConfigs.js + BaseNode.js)**
- "Instead of writing separate components for each node, I use configs"
- "BaseNode reads config and renders fields/handles dynamically"
- "Adding a new node = adding ~10 lines of config"

**2. TextNode Dynamic Handles (show textNode.js)**
- "Regex finds all {{variable}} patterns"
- "useUpdateNodeInternals tells ReactFlow handles changed"
- "Each variable gets an input handle on the left"

**3. State Management (show store.js)**
- "Zustand for global state - simpler than Redux"
- "nodes[] and edges[] hold the pipeline"
- "updateNodeField syncs form changes to store"

**4. Backend DAG Check (show main.py)**
- "Kahn's algorithm for topological sort"
- "Start with nodes that have 0 incoming edges"
- "If we process all nodes, no cycles exist"
- "O(V+E) time complexity"

### Questions You Might Get

**Q: Why Zustand over Redux?**
A: Less boilerplate, direct state updates, simpler for this scale

**Q: Why config-driven nodes?**
A: Reduces duplication, easy to add new nodes, single source of truth

**Q: How does cycle detection work?**
A: Kahn's algorithm - keep removing nodes with no dependencies. If stuck before processing all, there's a cycle.

**Q: Why useUpdateNodeInternals?**
A: ReactFlow caches handle positions. When handles change dynamically, this tells it to recalculate.

---

## Features Checklist

| Feature | What to Show |
|---------|--------------|
| Drag & Drop | Drag from toolbar, drop on canvas |
| Node Types | 9 different nodes with unique colors |
| Form Fields | Edit Input/Output name and type |
| Connections | Drag handle to handle |
| Dynamic Handles | Type {{var}} in Text node |
| Delete | Select node/edge, press Delete |
| Zoom/Pan | Scroll wheel, drag canvas |
| DAG Validation | Submit button shows results |

---

## Common Issues During Demo

**Backend won't start**
```bash
pip install fastapi uvicorn pydantic
```

**CORS error in console**
- Backend not running or wrong port
- Check localhost:8000 returns {"status":"ok"}

**Nodes won't connect**
- Can only connect source (right) → target (left)
- Same-type handles won't connect

**Handles not updating in TextNode**
- Check variable syntax: must be {{name}} with valid identifier
