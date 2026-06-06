"use client";

import React, { useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCodeStore } from '../store/useCodeStore';
import dagre from 'dagre';
import { Database } from 'lucide-react';

// Custom Nodes for Heap Objects/Arrays
const ObjectNode = ({ data }: any) => {
  const isArray = data.obj.__type === 'array';
  
  return (
    <div className="bg-card border border-border shadow-xl rounded-md text-[11px] text-foreground min-w-[140px] font-mono overflow-hidden transition-colors hover:border-accent group/node">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="bg-secondary/70 text-muted-foreground text-[9px] px-2.5 py-1.5 border-b border-border font-semibold uppercase tracking-wide flex justify-between items-center group-hover/node:text-foreground transition-colors">
        <span className="flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-accent" />
          {isArray ? 'Array' : 'Object'}
        </span>
        <span className="opacity-40 font-mono tracking-normal">{data.id}</span>
      </div>
      
      <div className="p-0">
        {Object.entries(data.obj).map(([key, val]) => {
          if (key === '__type') return null;
          
          let displayVal = String(val);
          let color = "text-[#cdd6f4]";
          
          if (val && typeof val === 'object' && '__ref' in val) {
            displayVal = `[ref ${val.__ref}]`;
            color = "text-[#89b4fa]"; // references point out
          } else if (typeof val === 'number') {
            color = "text-[#fab387]";
          } else if (typeof val === 'string') {
            displayVal = `"${val}"`;
            color = "text-[#a6e3a1]";
          }

          return (
            <div key={key} className="flex border-b border-border/40 last:border-0 hover:bg-white/5 relative group/row transition-colors">
              <div className="w-[40px] px-2 py-1.5 border-r border-border/40 text-muted-foreground text-[9px] font-semibold flex items-center justify-center bg-secondary/20 shrink-0 group-hover/row:text-foreground">
                {key}
              </div>
              <div className={`flex-1 px-2.5 py-1.5 text-[10px] truncate flex items-center font-bold ${color}`} title={displayVal}>
                {displayVal}
              </div>
            </div>
          );
        })}
      </div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  objectNode: ObjectNode,
};

export function HeapVisualizer() {
  const heap = useCodeStore((state) => state.executionState.heap);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    let newNodes: Node[] = [];
    let newEdges: Edge[] = [];

    // 1. Create Nodes
    Object.entries(heap).forEach(([id, obj]) => {
      newNodes.push({
        id,
        type: 'objectNode',
        data: { id, obj },
        position: { x: 0, y: 0 }, // temporary
      });

      // 2. Create Edges based on references
      Object.entries(obj).forEach(([key, val]) => {
        if (val && typeof val === 'object' && '__ref' in val) {
          newEdges.push({
            id: `e-${id}-${key}-${(val as any).__ref}`,
            source: id,
            target: String((val as any).__ref),
            label: key,
            animated: true,
            style: { stroke: 'var(--accent)', strokeWidth: 1.5 },
            labelStyle: { fill: 'var(--primary)', fontSize: 9, fontWeight: 900 },
            labelBgStyle: { fill: 'var(--card)', fillOpacity: 0.9 },
            markerEnd: { type: MarkerType.ArrowClosed, color: 'var(--accent)' },
          });
        }
      });
    });

    // 3. Apply Dagre Layout
    if (newNodes.length > 0) {
      const g = new dagre.graphlib.Graph();
      g.setGraph({ rankdir: 'TB', ranksep: 60, nodesep: 40 });
      g.setDefaultEdgeLabel(() => ({}));

      newNodes.forEach((node) => {
        const rowCount = Object.keys(node.data.obj as object).length;
        g.setNode(node.id, { width: 140, height: 30 + (rowCount * 25) }); // rough height estimation based on rows
      });

      newEdges.forEach((edge) => {
        g.setEdge(edge.source, edge.target);
      });

      dagre.layout(g);

      newNodes = newNodes.map((node) => {
        const nodeWithPosition = g.node(node.id);
        return {
          ...node,
          position: {
            x: nodeWithPosition.x - 70,
            y: nodeWithPosition.y - (30 + (Object.keys(node.data.obj as object).length * 25)) / 2,
          },
        };
      });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [heap, setNodes, setEdges]);

  if (Object.keys(heap).length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background text-muted-foreground/40 p-8">
        <div className="w-14 h-14 rounded-lg bg-secondary/40 flex items-center justify-center mb-4 border border-border">
          <Database size={24} className="opacity-50" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-wide mb-1 text-muted-foreground">Memory Sandbox Empty</div>
        <div className="text-[10px] max-w-[180px] text-center opacity-60 leading-relaxed">
          Initialize objects or linked lists in the editor to see them visually mapped in real-time.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.8}
      >
        <Background color="var(--border)" gap={24} size={1} />
        <Controls showInteractive={false} className="bg-card border-border fill-foreground rounded-md shadow-lg" />
      </ReactFlow>
    </div>
  );
}
