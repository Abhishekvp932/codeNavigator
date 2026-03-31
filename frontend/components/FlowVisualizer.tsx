"use client";

import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node as ReactFlowNode,
  Edge as ReactFlowEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useCodeStore } from '../store/useCodeStore';

export function FlowVisualizer() {
  const storeNodes = useCodeStore((state) => state.flowNodes);
  const storeEdges = useCodeStore((state) => state.flowEdges);
  const currentStepNodeId = useCodeStore((state) => state.executionState.currentStepNodeId);

  const [nodes, setNodes, onNodesChange] = useNodesState<ReactFlowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);

  useEffect(() => {
    // Sync store nodes to local ReactFlow state, applying highlight to active node
    const highlightedNodes = storeNodes.map(node => {
      if (node.id === currentStepNodeId) {
        return {
          ...node,
          style: {
            ...node.style,
            background: 'var(--primary)', // Highlight color
            color: 'var(--primary-foreground)',
            border: '2px solid var(--primary)',
            boxShadow: '0 0 20px var(--primary)',
            transform: 'scale(1.08)',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }
        };
      }
      return node;
    });
    setNodes(highlightedNodes);
  }, [storeNodes, currentStepNodeId, setNodes]);

  useEffect(() => {
    // Also highlight edges leading to or from the current node optionally
    const highlightedEdges = storeEdges.map(edge => {
      if (edge.source === currentStepNodeId || edge.target === currentStepNodeId) {
        return {
          ...edge,
          animated: true,
          style: { stroke: 'var(--primary)', strokeWidth: 3 }
        };
      }
      return {
        ...edge,
        animated: false,
        style: { stroke: 'var(--secondary)', strokeWidth: 1.5 }
      };
    });
    setEdges(highlightedEdges);
  }, [storeEdges, currentStepNodeId, setEdges]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="flex-1 h-full bg-background relative overflow-hidden group/flow">
      <div className="absolute top-3 left-3 z-10 bg-card/60 backdrop-blur-md border border-border/50 text-muted-foreground px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-black/20 group cursor-default hover:bg-card/90 transition-all">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        Control Flow Map
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="w-full h-full"
        colorMode="dark"
      >
        <Controls 
          className="bg-card border-border fill-foreground rounded-md shadow-lg" 
          position="bottom-left"
        />
        <MiniMap 
          nodeColor={(n) => n.style?.background?.toString() || 'var(--card)'} 
          maskColor="rgba(0,0,0,0.4)"
          className="bg-card border-border rounded-lg overflow-hidden shadow-2xl" 
          position="bottom-right"
        />
        <Background gap={24} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
