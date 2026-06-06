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
            boxShadow: '0 0 0 4px color-mix(in srgb, var(--primary) 20%, transparent)',
            transition: 'background 0.2s, border 0.2s, box-shadow 0.2s'
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
    <div className="h-full w-full bg-background relative overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className="w-full h-full"
        colorMode="dark"
        minZoom={0.25}
        maxZoom={1.8}
        fitViewOptions={{ padding: 0.18 }}
      >
        <Controls 
          className="bg-card border-border fill-foreground rounded-md shadow-lg" 
          position="bottom-left"
        />
        <MiniMap 
          nodeColor={(n) => n.style?.background?.toString() || 'var(--card)'} 
          maskColor="rgba(5,8,12,0.55)"
          className="bg-card border-border rounded-md overflow-hidden shadow-xl" 
          position="bottom-right"
        />
        <Background gap={24} size={1} color="var(--border)" />
      </ReactFlow>
    </div>
  );
}
