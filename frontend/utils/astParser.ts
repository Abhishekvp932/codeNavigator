import { parse } from '@babel/parser';
import _traverse from '@babel/traverse';
import type { Node, NodePath } from '@babel/traverse';
import type { Node as ReactFlowNode, Edge as ReactFlowEdge } from '@xyflow/react';
import * as t from '@babel/types';
import dagre from 'dagre';

const traverse = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;

export interface FlowGraph {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
}

export function generateFlowGraph(code: string): FlowGraph {
  const nodes: ReactFlowNode[] = [];
  const edges: ReactFlowEdge[] = [];

  try {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
    });

    const addNode = (id: string, label: string, type: 'default' | 'input' | 'output' = 'default') => {
      nodes.push({
        id,
        position: { x: 0, y: 0 },
        data: { label },
        type,
        style: {
          background: '#1e1e2e',
          color: '#cdd6f4',
          border: '1px solid #cba6f7',
          borderRadius: '8px',
          padding: '10px',
          width: 250,
        },
      });
    };

    const addEdge = (source: string, target: string, label?: string) => {
      edges.push({
        id: `e-${source}-${target}`,
        source,
        target,
        label,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#cba6f7' },
      });
    };

    let prevNodeId: string | null = null;
    let entryNodeId = 'start';

    addNode(entryNodeId, 'Start', 'input');
    prevNodeId = entryNodeId;

    traverse(ast, {
      enter(path: any) {
        (path.node as any).flowId = `node-${path.node.start}-${path.node.end}`;
      }
    });

    const getCodeString = (n: any, maxLen = 40) => {
      if (!n || typeof n.start !== 'number' || typeof n.end !== 'number') return '?';
      let str = code.slice(n.start, n.end).replace(/\s+/g, ' ').trim();
      return str.length > maxLen ? str.substring(0, maxLen - 3) + '...' : str;
    };

    const walk = (node: any) => {
      if (!node) return;
      
      const id = node.flowId;

      switch (node.type) {
        case 'VariableDeclaration': {
          const kind = node.kind;
          const declarations = node.declarations.map((d: any) => getCodeString(d.id)).join(', ');
          
          addNode(id, `Declare: ${kind} ${declarations}`);
          if (prevNodeId) addEdge(prevNodeId, id);
          prevNodeId = id;
          break;
        }
        case 'ExpressionStatement': {
          let label = 'Expression';
          if (node.expression.type === 'AssignmentExpression') {
            label = `Assign: ${getCodeString(node.expression.left)} = ...`;
          } else if (node.expression.type === 'CallExpression') {
            label = `Call: ${getCodeString(node.expression.callee)}(...)`;
          } else {
            label = getCodeString(node.expression);
          }
          addNode(id, label);
          if (prevNodeId) addEdge(prevNodeId, id);
          prevNodeId = id;
          break;
        }
        case 'IfStatement': {
          addNode(id, 'If Condition');
          if (prevNodeId) addEdge(prevNodeId, id);
          
          const conditionNodeId = id;
          prevNodeId = conditionNodeId;
          
          // Consequent branch
          walk(node.consequent);
          const endConsequentId = prevNodeId;
          
          let endAlternateId = conditionNodeId;
          if (node.alternate) {
            prevNodeId = conditionNodeId;
            walk(node.alternate);
            endAlternateId = prevNodeId as string;
          }
          
          const mergeNodeId = `${id}-merge`;
          addNode(mergeNodeId, 'Merge Paths');
          if (endConsequentId && endConsequentId !== conditionNodeId) addEdge(endConsequentId, mergeNodeId);
          if (endAlternateId) addEdge(endAlternateId, mergeNodeId);
          
          prevNodeId = mergeNodeId;
          break;
        }
        case 'ForStatement': {
          // Init
          if (node.init) {
            walk(node.init);
          }
          
          // Test Condition
          const testId = node.test ? node.test.flowId : `${id}-test`;
          if (node.test) {
            const label = `Check: ${getCodeString(node.test)}`;
            addNode(testId, label);
            if (prevNodeId) addEdge(prevNodeId, testId, 'loop');
            prevNodeId = testId;
          }
          const conditionNodeId = prevNodeId;
          
          // Body
          walk(node.body);
          
          // Update
          if (node.update) {
            const updateId = node.update.flowId;
            const label = `Update: ${getCodeString(node.update)}`;
            addNode(updateId, label);
            if (prevNodeId) addEdge(prevNodeId, updateId);
            prevNodeId = updateId;
          }
          
          // Edge back
          if (prevNodeId && conditionNodeId) {
            addEdge(prevNodeId, conditionNodeId, 'repeat');
          }
          
          prevNodeId = conditionNodeId; // Follow the false branch out of the loop
          
          break;
        }
        case 'WhileStatement': {
          const testId = node.test ? node.test.flowId : `${id}-test`;
          if (node.test) {
            const label = `While: ${getCodeString(node.test)}`;
            addNode(testId, label);
            if (prevNodeId) addEdge(prevNodeId, testId, 'loop');
            prevNodeId = testId;
          }
          const conditionNodeId = prevNodeId;
          
          walk(node.body);
          
          if (prevNodeId && conditionNodeId) {
            addEdge(prevNodeId, conditionNodeId, 'repeat');
          }
          
          prevNodeId = conditionNodeId;
          break;
        }
        case 'FunctionDeclaration': {
          const funcId = id;
          const name = node.id ? node.id.name : 'anonymous';
          const params = node.params.map((p: any) => p.name).join(', ');
          addNode(funcId, `Function: ${name}(${params})`);
          if (prevNodeId) addEdge(prevNodeId, funcId);
          prevNodeId = funcId;

          // Disconnect body from linear flow 
          const returnToNodeId = prevNodeId;
          
          // Render function body below, but execution will jump here
          const startFuncId = `${funcId}-start`;
          addNode(startFuncId, `Start ${name}`, 'input');
          prevNodeId = startFuncId;
          walk(node.body);
          
          const endFuncId = `${funcId}-end`;
          addNode(endFuncId, `End ${name}`, 'output');
          if (prevNodeId) addEdge(prevNodeId, endFuncId);

          prevNodeId = returnToNodeId;
          break;
        }
        case 'ReturnStatement': {
          addNode(id, `Return ${node.argument ? getCodeString(node.argument) : ''}`);
          if (prevNodeId) addEdge(prevNodeId, id);
          prevNodeId = id;
          break;
        }
        case 'BreakStatement': {
          addNode(id, `Break`);
          if (prevNodeId) addEdge(prevNodeId, id);
          prevNodeId = id;
          break;
        }
        case 'ContinueStatement': {
          addNode(id, `Continue`);
          if (prevNodeId) addEdge(prevNodeId, id);
          prevNodeId = id;
          break;
        }
        case 'BlockStatement': {
          for (const stmt of node.body) {
            walk(stmt);
          }
          break;
        }
      }
    };

    if (ast.program.body) {
      for (const stmt of ast.program.body) {
        walk(stmt);
      }
    }

    const endNodeId = 'end';
    addNode(endNodeId, 'End', 'output');
    if (prevNodeId) addEdge(prevNodeId, endNodeId);

    // Apply Dagre auto-layout
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: 'TB', nodesep: 50, ranksep: 80 });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 250, height: 60 });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.position = {
        x: nodeWithPosition.x - 125, // offset by half width
        y: nodeWithPosition.y - 30,  // offset by half height
      };
    });

  } catch (error) {
    console.error("Error parsing AST:", error);
  }

  return { nodes, edges };
}
