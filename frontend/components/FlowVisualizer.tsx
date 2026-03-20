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
            background: '#a6e3a1', // Highlight color
            color: '#11111b',
            border: '2px solid #94e2d5',
            boxShadow: '0 0 15px #a6e3a1',
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease'
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
          style: { stroke: '#a6e3a1', strokeWidth: 3 }
        };
      }
      return {
        ...edge,
        animated: false,
        style: { stroke: '#cba6f7', strokeWidth: 1 }
      };
    });
    setEdges(highlightedEdges);
  }, [storeEdges, currentStepNodeId, setEdges]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <div className="flex-1 h-full bg-[#181825] relative">
      <div className="absolute top-0 left-0 p-3 bg-[#11111b] border-b border-r border-[#313244] text-[#a6adc8] font-semibold text-sm z-10 rounded-br-lg opacity-80 backdrop-blur-sm">
        Visualization
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
          className="bg-[#1e1e2e] border-[#313244] fill-[#cdd6f4]" 
          position="bottom-left"
        />
        <MiniMap 
          nodeColor={(n) => n.style?.background?.toString() || '#1e1e2e'} 
          maskColor="rgba(17, 17, 27, 0.7)"
          className="bg-[#11111b] border-[#313244]" 
          position="bottom-right"
        />
        <Background gap={20} size={1} color="#313244" />
      </ReactFlow>
    </div>
  );
}
