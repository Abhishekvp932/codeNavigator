"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, StepForward, RotateCcw } from 'lucide-react';
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
    <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md px-4 py-2 border border-border shadow-2xl rounded-full transition-all duration-300 hover:shadow-primary/10">
      <div className="flex items-center gap-2.5">
        {!isRunning || isPaused ? (
          <button 
            onClick={isRunning ? handleResume : handleStart} 
            className="group flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
          >
            <Play size={12} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
            {isRunning ? "Resume" : "Run Code"}
          </button>
        ) : (
          <button 
            onClick={handlePause} 
            className="group flex items-center gap-2 bg-muted text-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-secondary active:scale-95 transition-all shadow-md"
          >
            <Pause size={12} fill="currentColor" className="group-hover:scale-110 transition-transform" /> 
            Pause
          </button>
        )}
        
        <button 
          onClick={handleStep} 
          className="group flex items-center gap-2 bg-accent text-accent-foreground px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-accent/20"
        >
          <StepForward size={12} className="group-hover:translate-x-0.5 transition-transform" /> 
          Step
        </button>

        <button 
          onClick={handleStop} 
          disabled={!isRunning} 
          className="group flex items-center gap-2 bg-destructive/10 text-destructive border border-destructive/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-destructive hover:text-destructive-foreground active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          <RotateCcw size={12} className="group-rotate-180 transition-transform duration-500" /> 
          Reset
        </button>
      </div>

      <div className="h-6 w-px bg-border mx-1" />

      <div className="flex items-center gap-3 text-muted-foreground text-[10px] font-bold uppercase tracking-widest pl-1">
        <label className="opacity-70 whitespace-nowrap">Speed</label>
        <div className="relative flex items-center group/slider">
          <input 
            type="range" 
            min="100" 
            max="2000" 
            step="100" 
            value={speed} 
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-primary h-1 bg-secondary rounded-full appearance-none cursor-pointer transition-all group-hover/slider:h-1.5"
          />
        </div>
        <span className="w-12 text-right font-mono text-primary">{speed}ms</span>
      </div>
    </div>
  );
}
