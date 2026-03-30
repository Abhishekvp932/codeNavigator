"use client";

import React, { useMemo, useEffect } from 'react';
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
    <div className="bg-[#1e1e2e] border-2 border-[#f9e2af] shadow-lg shadow-[#11111b]/50 rounded-md text-sm text-[#cdd6f4] min-w-[120px] font-mono overflow-hidden">
      <Handle type="target" position={Position.Top} className="opacity-0" />
      
      <div className="bg-[#f9e2af]/10 text-[#f9e2af] text-xs px-2 py-1 border-b border-[#f9e2af]/30 font-bold flex justify-between">
        <span>{isArray ? 'Array' : 'Object'}</span>
        <span className="opacity-70 text-[10px]">{data.id}</span>
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
            <div key={key} className="flex border-b border-[#313244]/50 last:border-0 hover:bg-[#313244]/30 relative">
              <div className="w-1/3 min-w-[30px] px-2 py-1 border-r border-[#313244]/50 text-[#9399b2] text-[11px] flex items-center justify-center bg-[#181825]/50">
                {key}
              </div>
              <div className={`w-2/3 px-2 py-1 text-[11px] truncate flex items-center ${color}`} title={displayVal}>
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

  useMemo(() => {
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
            style: { stroke: '#f9e2af', strokeWidth: 2 },
            labelStyle: { fill: '#cba6f7', fontSize: 10, fontWeight: 700 },
            labelBgStyle: { fill: '#181825', fillOpacity: 0.8 },
            markerEnd: { type: MarkerType.ArrowClosed, color: '#f9e2af' },
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
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#1e1e2e] text-[#6c7086]">
        <Database size={32} className="mb-3 opacity-50" />
        <div className="text-sm italic">Heap memory is empty.</div>
        <div className="text-xs opacity-50 max-w-xs text-center mt-2">Create Arrays or Objects to see them visually mapped here.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#1e1e2e]">
      <div className="absolute top-2 left-2 z-10 bg-[#11111b]/80 backdrop-blur-md border border-[#313244] text-[#a6adc8] px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 shadow-lg">
        <Database size={14} className="text-[#f9e2af]" />
        Heap & Data Structures
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={2}
      >
        <Background color="#313244" gap={20} size={1.5} />
        <Controls showInteractive={false} className="bg-[#181825] border-[#313244] fill-[#cdd6f4]" />
      </ReactFlow>
    </div>
  );
}
