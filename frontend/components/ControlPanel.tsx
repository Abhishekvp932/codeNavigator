"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, StepForward, RotateCcw, Gauge } from 'lucide-react';
import { useCodeStore } from '../store/useCodeStore';
import { StepEvent } from '../utils/executor';

export function ControlPanel() {
  const code = useCodeStore((state) => state.code);
  const { isRunning, isPaused } = useCodeStore((state) => state.executionState);
  const updateExecutionState = useCodeStore((state) => state.updateExecutionState);
  const addConsoleOutput = useCodeStore((state) => state.addConsoleOutput);
  const resetExecution = useCodeStore((state) => state.resetExecution);

  const workerRef = useRef<Worker | null>(null);

  // Auto-play interval
  const [speed, setSpeed] = useState(500); // ms per step

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('../workers/executor.worker.ts', import.meta.url), { type: 'module' });
    
    workerRef.current.onmessage = (e: MessageEvent<StepEvent | { type: 'STARTED' | 'STOPPED' }>) => {
      const event = e.data;
      
      switch (event.type) {
        case 'STARTED':
          updateExecutionState({ isRunning: true, isPaused: false });
          break;
        case 'STEP':
          updateExecutionState({ 
            currentStepNodeId: event.nodeId, 
            variables: event.variables,
            callStack: event.callStack || [],
            heap: event.heap || {}
          });
          break;
        case 'CONSOLE':
          addConsoleOutput(event.output);
          break;
        case 'ERROR':
          addConsoleOutput(`Error: ${event.message}`);
          updateExecutionState({ isRunning: false, isPaused: false });
          break;
        case 'END':
          updateExecutionState({ isRunning: false, isPaused: false, currentStepNodeId: null });
          break;
        case 'STOPPED':
          // Handled in reset
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        workerRef.current?.postMessage({ type: 'STEP' });
      }, speed);
    }
    return () => clearInterval(interval);
  }, [isRunning, isPaused, speed]);

  const handleStart = () => {
    resetExecution();
    workerRef.current?.postMessage({ type: 'START', payload: { code } });
    setTimeout(() => {
      updateExecutionState({ isRunning: true, isPaused: false });
      workerRef.current?.postMessage({ type: 'STEP' }); // Initial step
    }, 100);
  };

  const handlePause = () => {
    updateExecutionState({ isPaused: true });
  };

  const handleResume = () => {
    updateExecutionState({ isPaused: false });
  };

  const handleStep = () => {
    if (!isRunning) {
      handleStart();
      setTimeout(() => {
        updateExecutionState({ isPaused: true });
      }, 150);
    } else {
      updateExecutionState({ isPaused: true });
      workerRef.current?.postMessage({ type: 'STEP' });
    }
  };

  const handleRestart = () => {
    workerRef.current?.postMessage({ type: 'STOP' });
    resetExecution();
    setTimeout(handleStart, 100);
  };

  const handleStop = () => {
    workerRef.current?.postMessage({ type: 'STOP' });
    resetExecution();
  }

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card/95 px-2.5 py-2 shadow-xl backdrop-blur">
      <div className="flex items-center gap-1.5">
        {!isRunning || isPaused ? (
          <button 
            onClick={isRunning ? handleResume : handleStart} 
            className="group flex h-8 items-center gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:brightness-110 active:translate-y-px"
          >
            <Play size={13} fill="currentColor" />
            {isRunning ? "Resume" : "Run Code"}
          </button>
        ) : (
          <button 
            onClick={handlePause} 
            className="group flex h-8 items-center gap-2 rounded-md bg-secondary px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted active:translate-y-px"
          >
            <Pause size={13} fill="currentColor" />
            Pause
          </button>
        )}
        
        <button 
          onClick={handleStep} 
          className="group flex h-8 items-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-semibold text-foreground transition-colors hover:bg-secondary active:translate-y-px"
        >
          <StepForward size={13} />
          Step
        </button>

        <button 
          onClick={handleStop} 
          disabled={!isRunning} 
          className="group flex h-8 items-center gap-2 rounded-md border border-destructive/25 bg-destructive/10 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-primary-foreground active:translate-y-px disabled:pointer-events-none disabled:opacity-35"
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      <div className="h-6 w-px bg-border" />

      <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-semibold">
        <Gauge size={13} />
        <label className="whitespace-nowrap">Speed</label>
        <div className="relative flex items-center group/slider">
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="100" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="h-1 w-24 cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
          />
        </div>
        <span className="w-12 text-right font-mono text-primary">{speed}ms</span>
      </div>
    </div>
  );
}
