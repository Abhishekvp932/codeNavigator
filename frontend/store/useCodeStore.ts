import { create } from 'zustand';
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';

export interface ExecutionState {
  isRunning: boolean;
  isPaused: boolean;
  currentStepNodeId: string | null;
  variables: Record<string, any>;
  callStack: { funcName: string; locals: Record<string, any> }[];
  heap: Record<string, any>;
  consoleOutput: string[];
}

interface CodeStore {
  code: string;
  setCode: (code: string) => void;

  flowNodes: ReactFlowNode[];
  flowEdges: ReactFlowEdge[];
  setFlowGraph: (nodes: ReactFlowNode[], edges: ReactFlowEdge[]) => void;

  executionState: ExecutionState;
  updateExecutionState: (partial: Partial<ExecutionState>) => void;
  addConsoleOutput: (output: string) => void;
  resetExecution: () => void;
}

const initialExecutionState: ExecutionState = {
  isRunning: false,
  isPaused: false,
  currentStepNodeId: null,
  variables: {},
  callStack: [],
  heap: {},
  consoleOutput: [],
};

const defaultCode = `// CodeNavigator MVP
// Type or paste your JavaScript code here to see it visualized...
let x = 10;
let y = 20;
let sum = x + y;  
`;

export const useCodeStore = create<CodeStore>((set) => ({
  code: defaultCode,
  setCode: (code) => set({ code }),

  flowNodes: [],
  flowEdges: [],
  setFlowGraph: (nodes, edges) => set({ flowNodes: nodes, flowEdges: edges }),

  executionState: { ...initialExecutionState },
  updateExecutionState: (partial) => set((state) => ({
    executionState: { ...state.executionState, ...partial }
  })),

  addConsoleOutput: (output) => set((state) => ({
    executionState: {
      ...state.executionState,
      consoleOutput: [...state.executionState.consoleOutput, output]
    }
  })),

  resetExecution: () => set({ executionState: { ...initialExecutionState } })
}));
