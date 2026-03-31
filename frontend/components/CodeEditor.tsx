"use client";

import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { useCodeStore } from '../store/useCodeStore';
import { generateFlowGraph } from '../utils/astParser';
import { Code2, AlertCircle, Loader2 } from 'lucide-react';

// Defer Prism as it can cause build-time SSR issues
let Prism: any = null;

export function CodeEditor() {
  const code = useCodeStore((state) => state.code);
  const setCode = useCodeStore((state) => state.setCode);
  const setFlowGraph = useCodeStore((state) => state.setFlowGraph);
  const isRunning = useCodeStore((state) => state.executionState.isRunning);
  
  const [mounted, setMounted] = useState(false);
  const [prismReady, setPrismReady] = useState(false);
  const [highlightError, setHighlightError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    
    // Load Prism and languages on the client only
    const loadPrism = async () => {
      try {
        Prism = (await import('prismjs')).default;
        await import('prismjs/components/prism-clike');
        await import('prismjs/components/prism-javascript');
        setPrismReady(true);
      } catch (err: any) {
        setHighlightError("Syntax engine failed to load");
        console.error(err);
      }
    };
    
    loadPrism();
  }, []);

  // Re-generate flow graph whenever code changes, unless running
  useEffect(() => {
    if (!isRunning && mounted) {
      try {
        const { nodes, edges } = generateFlowGraph(code);
        setFlowGraph(nodes, edges);
      } catch (e: any) {
        // Silently fail graph gen if code is mid-edit/invalid
      }
    }
  }, [code, isRunning, setFlowGraph, mounted]);

  if (!mounted || !prismReady) {
    return (
      <div className="flex flex-col h-full bg-card border-r border-border overflow-hidden">
        <div className="px-3 py-2 bg-secondary/50 border-b border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 shrink-0">
          <Code2 size={14} className="text-primary" /> Source Editor
        </div>
        <div className="flex-1 flex flex-col items-center justify-center font-mono text-[11px] text-muted-foreground/30 gap-2">
          <Loader2 size={16} className="animate-spin text-primary/40" />
          <span>Initializing Syntax Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card border-r border-border overflow-hidden">
      <div className="px-3 py-2 bg-secondary/50 border-b border-border text-muted-foreground font-bold text-[10px] uppercase tracking-widest flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-primary" /> 
          Source Editor
        </div>
        {highlightError && (
          <div className="flex items-center gap-1 text-destructive text-[8px] font-black uppercase">
            <AlertCircle size={10} /> {highlightError}
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar code-editor-container relative">
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
          highlight={(code) => {
            if (!Prism || !Prism.languages.javascript) {
              return code.replace(/[&<>]/g, (m: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m));
            }
            try {
              return Prism.highlight(code, Prism.languages.javascript, 'javascript');
            } catch (e) {
              return code;
            }
          }}
          padding={20}
          disabled={isRunning}
          className="font-mono text-[13px] min-h-full transition-opacity duration-300"
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            color: 'var(--foreground)',
            opacity: isRunning ? 0.6 : 1,
          }}
          textareaClassName="outline-none focus:ring-0 min-h-full"
          preClassName="min-h-full"
        />
      </div>
    </div>
  );
}
