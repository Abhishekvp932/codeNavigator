"use client";

import React, { useState, useRef, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { FlowVisualizer } from "@/components/FlowVisualizer";
import { ControlPanel } from "@/components/ControlPanel";
import { CallStackPanel } from "@/components/CallStackPanel";
import { ConsoleOutput } from "@/components/ConsoleOutput";
import { DirectOutput } from "@/components/DirectOutput";
import { HeapVisualizer } from "@/components/HeapVisualizer";
import Header from "@/layout/Header";

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(35); 
  const [topHeight, setTopHeight] = useState(50); 
  const [rightTopHeight, setRightTopHeight] = useState(60); 
  const [activeRightTab, setActiveRightTab] = useState<'flow' | 'heap'>('flow');
  const [isDraggingOverall, setIsDraggingOverall] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const isDraggingX = useRef(false);
  const isDraggingY = useRef(false);
  const isDraggingRightY = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (
        !isDraggingX.current &&
        !isDraggingY.current &&
        !isDraggingRightY.current
      )
        return;
      e.preventDefault();

      if (isDraggingX.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newWidth =
          ((e.clientX - containerRect.left) / containerRect.width) * 100;
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
        const newHeight =
          ((e.clientY - rightRect.top) / rightRect.height) * 100;
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
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <main className="flex flex-col h-screen w-full bg-background text-foreground font-sans overflow-hidden select-none">
      <div>
        <Header />
      </div>

      {isDraggingOverall && (
        <div
          className="fixed inset-0 z-[99999]"
          style={{ cursor: "inherit" }}
        />
      )}

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden" ref={containerRef}>
        {/* Left Sidebar (Code Editor & Terminals) */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="flex flex-col min-w-[200px]"
          ref={leftPanelRef}
        >
          {/* Code Editor */}
          <div
            style={{ height: `${topHeight}%` }}
            className="min-h-0 flex flex-col relative overflow-hidden"
          >
            <CodeEditor />
          </div>

          {/* Horizontal Resizer */}
          <div
            className="flex h-1.5 w-full bg-card hover:bg-primary transition-all duration-200 items-center justify-center cursor-row-resize border-y border-border z-50 relative group"
            onMouseDown={() => {
              isDraggingY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = "row-resize";
            }}
          >
            <div className="w-12 h-1 bg-muted rounded-full group-hover:bg-primary-foreground/50 transition-colors" />
          </div>

          {/* Call Stack & Console */}
          <div
            style={{ height: `${100 - topHeight}%` }}
            className="flex flex-col min-h-0 overflow-hidden"
          >
            <CallStackPanel />
            <ConsoleOutput />
          </div>
        </div>

        {/* Vertical Resizer */}
        <div
          className="flex w-1.5 h-full bg-card hover:bg-accent transition-all duration-200 items-center justify-center cursor-col-resize border-x border-border z-50 relative group"
          onMouseDown={() => {
            isDraggingX.current = true;
            setIsDraggingOverall(true);
            document.body.style.cursor = "col-resize";
          }}
        >
          <div className="h-12 w-1 bg-muted rounded-full group-hover:bg-accent-foreground/50 transition-colors" />
        </div>

        {/* Right Area (Flow Visualizer & Control Panel) */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="flex flex-col relative min-w-0 overflow-hidden"
          ref={rightPanelRef}
        >
          <div
            style={{ height: `${rightTopHeight}%` }}
            className="flex flex-col relative min-h-0 overflow-hidden bg-background"
          >
            {/* Tabs Header */}
            <div className="flex bg-card h-10 px-2 py-1 items-center gap-1.5 select-none z-10 shrink-0 border-b border-border">
              <button 
                onClick={() => setActiveRightTab('flow')}
                className={`flex-1 flex items-center justify-center gap-2 h-full rounded-md text-xs font-semibold tracking-wide transition-all ${activeRightTab === 'flow' ? 'bg-secondary text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}
              >
                Control Flow Map
              </button>
              <button 
                onClick={() => setActiveRightTab('heap')}
                className={`flex-1 flex items-center justify-center gap-2 h-full rounded-md text-xs font-semibold tracking-wide transition-all ${activeRightTab === 'heap' ? 'bg-accent/20 text-accent shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'}`}
              >
                Data Structures (Heap)
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="flex-1 relative overflow-hidden">
              {activeRightTab === 'flow' ? <FlowVisualizer /> : <HeapVisualizer />}
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50">
              <ControlPanel />
            </div>
          </div>

          <div
            className="flex h-1.5 w-full bg-card hover:bg-primary transition-all duration-200 items-center justify-center cursor-row-resize border-y border-border z-50 relative group"
            onMouseDown={() => {
              isDraggingRightY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = "row-resize";
            }}
          >
            <div className="w-12 h-1 bg-muted rounded-full group-hover:bg-primary-foreground/50 transition-colors" />
          </div>

          <div
            style={{ height: `${100 - rightTopHeight}%` }}
            className="flex flex-col min-h-0 overflow-hidden"
          >
            <DirectOutput />
          </div>
        </div>
      </div>
    </main>
  );
}
