"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { FlowVisualizer } from '../components/FlowVisualizer';
import { ControlPanel } from '../components/ControlPanel';
import { VariableTracker } from '../components/VariableTracker';
import { ConsoleOutput } from '../components/ConsoleOutput';
import { DirectOutput } from '../components/DirectOutput';
import Header from '@/layout/Header';

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(35); // Percentage
  const [topHeight, setTopHeight] = useState(50); // Percentage
  const [rightTopHeight, setRightTopHeight] = useState(60); // Percentage
  const [isDraggingOverall, setIsDraggingOverall] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isDraggingX = useRef(false);
  const isDraggingY = useRef(false);
  const isDraggingRightY = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingX.current && !isDraggingY.current && !isDraggingRightY.current) return;
      e.preventDefault();

      if (isDraggingX.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        if (newWidth > 5 && newWidth < 95) {
          setLeftWidth(newWidth);
        }
      }

      if (isDraggingY.current && leftPanelRef.current) {
        const leftRect = leftPanelRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - leftRect.top) / leftRect.height) * 100;
        if (newHeight > 5 && newHeight < 95) {
          setTopHeight(newHeight);
        }
      }

      if (isDraggingRightY.current && rightPanelRef.current) {
        const rightRect = rightPanelRef.current.getBoundingClientRect();
        const newHeight = ((e.clientY - rightRect.top) / rightRect.height) * 100;
        if (newHeight > 10 && newHeight < 95) {
          setRightTopHeight(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      isDraggingX.current = false;
      isDraggingY.current = false;
      isDraggingRightY.current = false;
      setIsDraggingOverall(false);
      document.body.style.cursor = 'default';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <main className="flex flex-col h-screen w-full bg-[#1e1e2e] text-[#cdd6f4] font-sans overflow-hidden select-none">
      <div>
        <Header />
      </div>

      {isDraggingOverall && (
        <div className="fixed inset-0 z-[99999]" style={{ cursor: 'inherit' }} />
      )}

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>

        {/* Left Sidebar (Code Editor & Terminals) */}
        <div style={{ width: `${leftWidth}%` }} className="flex flex-col min-w-[200px]" ref={leftPanelRef}>

          {/* Code Editor */}
          <div style={{ height: `${topHeight}%` }} className="min-h-0 flex flex-col relative overflow-hidden">
            <CodeEditor />
          </div>

          {/* Horizontal Resizer */}
          <div
            className="flex h-2 w-full bg-[#181825] hover:bg-[#cba6f7] transition-colors items-center justify-center cursor-row-resize border-y border-[#313244] z-50 relative"
            onMouseDown={() => {
              isDraggingY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = 'row-resize';
            }}
          >
            <div className="w-8 h-1 bg-[#45475a] rounded-full" />
          </div>

          {/* Variables & Console */}
          <div style={{ height: `${100 - topHeight}%` }} className="flex flex-col min-h-0 overflow-hidden">
            <VariableTracker />
            <ConsoleOutput />
          </div>

        </div>

        {/* Vertical Resizer */}
        <div
          className="flex w-2 h-full bg-[#181825] hover:bg-[#89b4fa] transition-colors items-center justify-center cursor-col-resize border-x border-[#313244] z-50 relative"
          onMouseDown={() => {
            isDraggingX.current = true;
            setIsDraggingOverall(true);
            document.body.style.cursor = 'col-resize';
          }}
        >
          <div className="h-8 w-1 bg-[#45475a] rounded-full" />
        </div>

        {/* Right Area (Flow Visualizer & Control Panel) */}
        <div style={{ width: `${100 - leftWidth}%` }} className="flex flex-col relative min-w-0 overflow-hidden" ref={rightPanelRef}>
          <div style={{ height: `${rightTopHeight}%` }} className="flex flex-col relative min-h-0 overflow-hidden">
            <FlowVisualizer />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 rounded-lg shadow-xl shadow-[#11111b]/50 border border-[#313244] overflow-hidden">
              <ControlPanel />
            </div>
          </div>
          
          <div 
            className="flex h-2 w-full bg-[#181825] hover:bg-[#cba6f7] transition-colors items-center justify-center cursor-row-resize border-y border-[#313244] z-50 relative"
            onMouseDown={() => {
              isDraggingRightY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = 'row-resize';
            }}
          >
            <div className="w-8 h-1 bg-[#45475a] rounded-full" />
          </div>

          <div style={{ height: `${100 - rightTopHeight}%` }} className="flex flex-col min-h-0 overflow-hidden">
            <DirectOutput />
          </div>
        </div>

      </div>
    </main>
  );
}
