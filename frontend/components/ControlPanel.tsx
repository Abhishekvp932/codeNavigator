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
            variables: event.variables 
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
    <div className="flex items-center gap-3 bg-[#11111b] p-2 border-b border-[#313244] rounded max-w-fit mx-auto shadow-lg">
      <div className="flex items-center gap-2">
        {!isRunning || isPaused ? (
          <button onClick={isRunning ? handleResume : handleStart} className="flex items-center gap-1.5 bg-[#a6e3a1] text-[#11111b] px-3 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition-colors">
            <Play size={14} fill="currentColor" /> {isRunning ? "Resume" : "Run Code"}
          </button>
        ) : (
          <button onClick={handlePause} className="flex items-center gap-1.5 bg-[#f9e2af] text-[#11111b] px-3 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition-colors">
            <Pause size={14} fill="currentColor" /> Pause
          </button>
        )}
        
        <button onClick={handleStep} className="flex items-center gap-1.5 bg-[#89b4fa] text-[#11111b] px-3 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition-colors">
          <StepForward size={14} /> Step
        </button>

        <button onClick={handleStop} disabled={!isRunning} className="flex items-center gap-1.5 bg-[#f38ba8] text-[#11111b] px-3 py-1.5 rounded text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50">
          <RotateCcw size={14} /> Stop & Reset
        </button>
      </div>

      <div className="ml-2 flex items-center gap-2 text-[#a6adc8] text-[11px] font-medium tracking-wide">
        <label className="uppercase">Speed:</label>
        <input 
          type="range" 
          min="100" 
          max="2000" 
          step="100" 
          value={speed} 
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-20 accent-[#cba6f7] h-1 bg-[#313244] rounded-lg appearance-none cursor-pointer"
        />
        <span className="w-10 text-right">{speed}ms</span>
      </div>
    </div>
  );
}
