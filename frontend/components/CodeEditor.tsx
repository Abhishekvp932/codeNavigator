"use client";

import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import { useCodeStore } from '../store/useCodeStore';
import { generateFlowGraph } from '../utils/astParser';
import { Code2, AlertCircle, Loader2, Lock } from 'lucide-react';

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
      <div className="cn-panel flex h-full flex-col rounded-none border-0">
        <div className="cn-panel-header">
          <span className="cn-icon-label"><Code2 size={14} /> Source Editor</span>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center font-mono text-[11px] text-muted-foreground gap-2">
          <Loader2 size={16} className="animate-spin text-primary/40" />
          <span>Initializing Syntax Engine...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cn-panel flex h-full flex-col rounded-none border-0">
      <div className="cn-panel-header">
        <div className="cn-icon-label">
          <Code2 size={14} />
          <span>Source Editor</span>
          {isRunning && (
            <span className="ml-2 inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[9px] text-primary normal-case">
              <Lock size={10} /> locked
            </span>
          )}
        </div>
        {highlightError && (
          <div className="flex items-center gap-1 text-destructive text-[10px] font-semibold normal-case">
            <AlertCircle size={10} /> {highlightError}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar code-editor-container relative bg-[#0b1017]">
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
          padding={16}
          disabled={isRunning}
          className="font-mono text-[13px] min-h-full min-w-max transition-opacity duration-300"
          style={{
            fontFamily: 'var(--font-geist-mono), monospace',
            color: 'var(--foreground)',
            opacity: isRunning ? 0.6 : 1,
            lineHeight: 1.65,
          }}
          textareaClassName="outline-none focus:ring-0 min-h-full min-w-max resize-none"
          preClassName="min-h-full min-w-max"
        />
      </div>
    </div>
  );
}
