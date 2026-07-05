# main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from collections import deque

app = FastAPI()

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models for request
class Position(BaseModel):
    x: float
    y: float

class NodeData(BaseModel):
    id: str
    class Config:
        extra = "allow"

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


def is_dag(nodes, edges):
    """Check if graph is DAG using Kahn's algorithm (topological sort)"""
    if not nodes:
        return True
    
    # Build adjacency list and count incoming edges
    node_ids = {n.id for n in nodes}
    in_degree = {nid: 0 for nid in node_ids}
    neighbors = {nid: [] for nid in node_ids}
    
    for edge in edges:
        if edge.source in node_ids and edge.target in node_ids:
            neighbors[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Start with nodes that have no incoming edges
    queue = deque([nid for nid, deg in in_degree.items() if deg == 0])
    count = 0
    
    while queue:
        node = queue.popleft()
        count += 1
        for neighbor in neighbors[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, it's a DAG (no cycles)
    return count == len(nodes)


@app.get('/')
def read_root():
    return {'status': 'ok'}


@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineRequest):
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag = is_dag(pipeline.nodes, pipeline.edges)
    
    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': dag
    }
