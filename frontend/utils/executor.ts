import { parse } from '@babel/parser';
import * as t from '@babel/types';

export type StepEvent = {
  type: 'STEP';
  nodeId: string;
  variables: Record<string, any>;
} | {
  type: 'CONSOLE';
  output: string;
} | {
  type: 'END';
} | {
  type: 'ERROR';
  message: string;
};

class ExecutorState {
  scopes: Record<string, any>[] = [{}];
  hasReturned: boolean = false;
  hasBroken: boolean = false;
  hasContinued: boolean = false;
  returnValue: any = undefined;

  pushScope() { this.scopes.push({}); }
  popScope() { this.scopes.pop(); }

  get(name: string) {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) return this.scopes[i][name];
    }
    return undefined;
  }

  set(name: string, value: any, declareLocal = false) {
    if (declareLocal) {
      this.scopes[this.scopes.length - 1][name] = value;
      return;
    }
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (name in this.scopes[i]) {
        this.scopes[i][name] = value;
        return;
      }
    }
    this.scopes[this.scopes.length - 1][name] = value;
  }

  getAllVars() {
    // Merge scopes for UI, but filter out functions to avoid massive clutter
    const merged = Object.assign({}, ...this.scopes);
    const safe: Record<string, any> = {};
    for (const k in merged) {
      if (merged[k] && merged[k].__isFunctional) {
        safe[k] = '[Function]';
      } else if (Array.isArray(merged[k])) {
        safe[k] = `[${merged[k].join(', ')}]`;
      } else {
        safe[k] = merged[k];
      }
    }
    return safe;
  }
}

export async function* executeCode(code: string): AsyncGenerator<StepEvent> {
  let ast;
  try {
    ast = parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  } catch (e: any) {
    yield { type: 'ERROR', message: `Parse error: ${e.message}` };
    return;
  }

  const state = new ExecutorState();
  const getNodeId = (node: t.Node) => `node-${node.start}-${node.end}`;

  async function* evaluateExpression(expr: t.Node | null): AsyncGenerator<StepEvent, any, unknown> {
    if (!expr) return undefined;
    
    switch (expr.type) {
      case 'NumericLiteral':
      case 'StringLiteral':
      case 'BooleanLiteral':
        return expr.value;
      case 'NullLiteral':
        return null;
      case 'Identifier':
        return state.get(expr.name);
      case 'ArrayExpression': {
        const arr = [];
        for (const el of expr.elements) {
          arr.push(yield* evaluateExpression(el));
        }
        return arr;
      }
      case 'MemberExpression': {
        const obj = yield* evaluateExpression(expr.object);
        const prop = expr.computed ? yield* evaluateExpression(expr.property) : (expr.property.type === 'Identifier' ? expr.property.name : undefined);
        if (obj === undefined || obj === null) return undefined;
        return obj[prop];
      }
      case 'BinaryExpression': {
        const left = yield* evaluateExpression(expr.left as t.Node);
        const right = yield* evaluateExpression(expr.right);
        switch (expr.operator) {
          case '+': return left + right;
          case '-': return left - right;
          case '*': return left * right;
          case '/': return left / right;
          case '==': return left == right;
          case '===': return left === right;
          case '!=': return left != right;
          case '!==': return left !== right;
          case '<': return left < right;
          case '<=': return left <= right;
          case '>': return left > right;
          case '>=': return left >= right;
        }
        return undefined;
      }
      case 'UpdateExpression': {
        if (expr.argument.type === 'Identifier') {
          let val = state.get(expr.argument.name);
          const oldVal = val;
          if (expr.operator === '++') val++;
          if (expr.operator === '--') val--;
          state.set(expr.argument.name, val);
          return expr.prefix ? val : oldVal;
        }
        return undefined;
      }
      case 'AssignmentExpression': {
        const value = yield* evaluateExpression(expr.right);
        if (expr.left.type === 'Identifier') {
          let current = state.get(expr.left.name) || 0;
          let newValue = value;
          if (expr.operator === '+=') newValue = current + value;
          else if (expr.operator === '-=') newValue = current - value;
          state.set(expr.left.name, newValue);
          return newValue;
        } else if (expr.left.type === 'MemberExpression') {
          const obj = yield* evaluateExpression(expr.left.object);
          const prop = expr.left.computed ? yield* evaluateExpression(expr.left.property) : (expr.left.property.type === 'Identifier' ? expr.left.property.name : undefined);
          if (obj) {
            obj[prop] = value;
          }
          return value;
        }
        return value;
      }
      case 'CallExpression': {
        const args: any[] = [];
        for (const arg of expr.arguments) {
          args.push(yield* evaluateExpression(arg));
        }

        if (expr.callee.type === 'Identifier') {
          const func = state.get(expr.callee.name);
          if (func && func.__isFunctional) {
            state.pushScope();
            func.node.params.forEach((p: any, i: number) => {
              if (p.type === 'Identifier') state.set(p.name, args[i], true);
            });
            // Execute function body
            yield* executeNode(func.node.body);
            const ret = state.returnValue;
            state.hasReturned = false;
            state.returnValue = undefined;
            state.popScope();
            return ret;
          }
        } else if (expr.callee.type === 'MemberExpression') {
          const obj = yield* evaluateExpression(expr.callee.object);
          const prop = expr.callee.computed ? yield* evaluateExpression(expr.callee.property) : (expr.callee.property.type === 'Identifier' ? expr.callee.property.name : undefined);
          
          if (expr.callee.object.type === 'Identifier' && expr.callee.object.name === 'console' && prop === 'log') {
            yield { type: 'CONSOLE', output: args.join(' ') };
            return undefined;
          }
          if (expr.callee.object.type === 'Identifier' && expr.callee.object.name === 'Math' && prop === 'floor') {
            return Math.floor(args[0]);
          }
          if (obj && typeof obj[prop] === 'function') {
            return obj[prop](...args);
          }
        }
        return undefined;
      }
    }
    return undefined;
  }

  async function* executeNode(node: t.Node): AsyncGenerator<StepEvent> {
    if (state.hasReturned) return;

    const announceNode = async function* (n: t.Node = node) {
      yield { type: 'STEP', nodeId: getNodeId(n), variables: state.getAllVars() } as StepEvent;
    };

    switch (node.type) {
      case 'FunctionDeclaration': {
        yield* announceNode();
        if (node.id) {
          state.set(node.id.name, { __isFunctional: true, node }, true);
        }
        yield { type: 'STEP', nodeId: getNodeId(node), variables: state.getAllVars() };
        break;
      }
      case 'VariableDeclaration': {
        yield* announceNode();
        for (const decl of node.declarations) {
          if (decl.id.type === 'Identifier') {
            const initVal = decl.init ? yield* evaluateExpression(decl.init) : undefined;
            state.set(decl.id.name, initVal, true);
          }
        }
        yield { type: 'STEP', nodeId: getNodeId(node), variables: state.getAllVars() };
        break;
      }
      case 'ExpressionStatement': {
        yield* announceNode();
        yield* evaluateExpression(node.expression);
        yield { type: 'STEP', nodeId: getNodeId(node), variables: state.getAllVars() };
        break;
      }
      case 'IfStatement': {
        yield* announceNode();
        const testRes = yield* evaluateExpression(node.test);
        if (testRes) {
          yield* executeNode(node.consequent);
        } else if (node.alternate) {
          yield* executeNode(node.alternate);
        }
        break;
      }
      case 'WhileStatement': {
        while (true) {
          if (node.test) {
            yield* announceNode(node.test);
            const testRes = yield* evaluateExpression(node.test);
            if (!testRes) break;
          }
          yield* executeNode(node.body);
          if (state.hasReturned) break;
          if (state.hasBroken) {
            state.hasBroken = false;
            break;
          }
          if (state.hasContinued) {
            state.hasContinued = false;
          }
        }
        break;
      }
      case 'ForStatement': {
        if (node.init) yield* executeNode(node.init);
        
        while (true) {
          if (node.test) {
            yield* announceNode(node.test);
            const testRes = yield* evaluateExpression(node.test);
            if (!testRes) break;
          }
          
          yield* executeNode(node.body);
          if (state.hasReturned) break;
          if (state.hasBroken) {
            state.hasBroken = false;
            break;
          }
          if (state.hasContinued) {
            state.hasContinued = false;
          }
          
          if (node.update) {
            yield* announceNode(node.update);
            yield* evaluateExpression(node.update);
            yield { type: 'STEP', nodeId: getNodeId(node.update), variables: state.getAllVars() };
          }
        }
        break;
      }
      case 'BlockStatement': {
        for (const stmt of node.body) {
          yield* executeNode(stmt);
          if (state.hasReturned || state.hasBroken || state.hasContinued) break;
        }
        break;
      }
      case 'ReturnStatement': {
        yield* announceNode();
        state.returnValue = node.argument ? yield* evaluateExpression(node.argument) : undefined;
        state.hasReturned = true;
        break;
      }
      case 'BreakStatement': {
        yield* announceNode();
        state.hasBroken = true;
        break;
      }
      case 'ContinueStatement': {
        yield* announceNode();
        state.hasContinued = true;
        break;
      }
    }
  }

  yield { type: 'STEP', nodeId: 'start', variables: {} };
  for (const stmt of ast.program.body) {
    yield* executeNode(stmt);
    if (state.hasReturned) break; // Should not happen at top level, but safe
  }
  yield { type: 'STEP', nodeId: 'end', variables: state.getAllVars() };
  yield { type: 'END' };
}
