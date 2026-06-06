"use client";

import React, { useEffect, useRef, useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { FlowVisualizer } from "@/components/FlowVisualizer";
import { ControlPanel } from "@/components/ControlPanel";
import { CallStackPanel } from "@/components/CallStackPanel";
import { ConsoleOutput } from "@/components/ConsoleOutput";
import { DirectOutput } from "@/components/DirectOutput";
import { HeapVisualizer } from "@/components/HeapVisualizer";
import Header from "@/layout/Header";
import { GitBranch, Database } from "lucide-react";

export default function Home() {
  const [leftWidth, setLeftWidth] = useState(40);
  const [topHeight, setTopHeight] = useState(64);
  const [rightTopHeight, setRightTopHeight] = useState(66);
  const [activeRightTab, setActiveRightTab] = useState<"flow" | "heap">("flow");
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
        const rect = containerRef.current.getBoundingClientRect();
        const next = ((e.clientX - rect.left) / rect.width) * 100;
        if (next >= 28 && next <= 62) setLeftWidth(next);
      }

      if (isDraggingY.current && leftPanelRef.current) {
        const rect = leftPanelRef.current.getBoundingClientRect();
        const next = ((e.clientY - rect.top) / rect.height) * 100;
        if (next >= 42 && next <= 78) setTopHeight(next);
      }

      if (isDraggingRightY.current && rightPanelRef.current) {
        const rect = rightPanelRef.current.getBoundingClientRect();
        const next = ((e.clientY - rect.top) / rect.height) * 100;
        if (next >= 44 && next <= 82) setRightTopHeight(next);
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
    <main className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <Header />

      {isDraggingOverall && <div className="fixed inset-0 z-[99999]" style={{ cursor: "inherit" }} />}

      <div ref={containerRef} className="flex min-h-0 flex-1 overflow-hidden p-2 gap-2">
        <section
          ref={leftPanelRef}
          style={{ width: `${leftWidth}%` }}
          className="flex min-w-[360px] flex-col overflow-hidden rounded-lg border border-border bg-background"
        >
          <div style={{ height: `${topHeight}%` }} className="min-h-[280px] min-w-0 overflow-hidden">
            <CodeEditor />
          </div>

          <div
            className="h-2 shrink-0 cursor-row-resize bg-background px-3 flex items-center"
            onMouseDown={() => {
              isDraggingY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = "row-resize";
            }}
          >
            <div className="h-px w-full bg-border" />
          </div>

          <div style={{ height: `${100 - topHeight}%` }} className="grid min-h-[170px] grid-cols-2 gap-2 overflow-hidden p-0">
            <CallStackPanel />
            <ConsoleOutput />
          </div>
        </section>

        <div
          className="w-2 shrink-0 cursor-col-resize bg-background py-3 flex justify-center"
          onMouseDown={() => {
            isDraggingX.current = true;
            setIsDraggingOverall(true);
            document.body.style.cursor = "col-resize";
          }}
        >
          <div className="h-full w-px bg-border" />
        </div>

        <section
          ref={rightPanelRef}
          style={{ width: `${100 - leftWidth}%` }}
          className="flex min-w-[480px] min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-background"
        >
          <div style={{ height: `${rightTopHeight}%` }} className="relative flex min-h-[320px] flex-col overflow-hidden">
            <div className="cn-panel-header">
              <div className="flex items-center gap-1 rounded-md bg-background p-1">
                <button
                  onClick={() => setActiveRightTab("flow")}
                  className={`h-7 inline-flex items-center gap-1.5 rounded px-2.5 text-[11px] font-semibold transition-colors ${
                    activeRightTab === "flow"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GitBranch size={13} />
                  Flow map
                </button>
                <button
                  onClick={() => setActiveRightTab("heap")}
                  className={`h-7 inline-flex items-center gap-1.5 rounded px-2.5 text-[11px] font-semibold transition-colors ${
                    activeRightTab === "heap"
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Database size={13} />
                  Heap
                </button>
              </div>
              <span className="hidden sm:block text-[10px] text-muted-foreground">
                Pan and zoom the canvas without resizing the workspace
              </span>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              {activeRightTab === "flow" ? <FlowVisualizer /> : <HeapVisualizer />}
              <div className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2">
                <ControlPanel />
              </div>
            </div>
          </div>

          <div
            className="h-2 shrink-0 cursor-row-resize bg-background px-3 flex items-center"
            onMouseDown={() => {
              isDraggingRightY.current = true;
              setIsDraggingOverall(true);
              document.body.style.cursor = "row-resize";
            }}
          >
            <div className="h-px w-full bg-border" />
          </div>

          <div style={{ height: `${100 - rightTopHeight}%` }} className="min-h-[170px] overflow-hidden">
            <DirectOutput />
          </div>
        </section>
      </div>
    </main>
  );
}
