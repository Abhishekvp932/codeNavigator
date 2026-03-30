import { parse } from '@babel/parser';
import * as t from '@babel/types';

export type StepEvent = {
  type: 'STEP';
  nodeId: string;
  callStack?: { funcName: string; locals: Record<string, any> }[];
  heap?: Record<string, any>;
  variables?: Record<string, any>; // legacy fallback
} | {
  type: 'CONSOLE';
  output: string;
} | {
  type: 'END';
} | {
  type: 'ERROR';
  message: string;
};

class CallFrame {
  scopes: Record<string, any>[] = [{}];
  constructor(public funcName: string, public thisContext?: any) {}
}

class ExecutorState {
  callStack: CallFrame[] = [new CallFrame('global')];
  hasReturned: boolean = false;
  hasBroken: boolean = false;
  hasContinued: boolean = false;
  returnValue: any = undefined;

  objectIdCounter = 1;
  objectMap = new Map<any, string>();

  get currentFrame() {
    return this.callStack[this.callStack.length - 1];
  }

  pushFrame(funcName: string, thisContext?: any) {
    if (this.callStack.length > 500) {
      throw new Error(`Maximum call stack size exceeded (500 frames). Detected infinite recursion in ${funcName}.`);
    }
    this.callStack.push(new CallFrame(funcName, thisContext));
  }
  popFrame() {
    this.callStack.pop();
  }

  pushScope() { this.currentFrame.scopes.push({}); }
  popScope() { this.currentFrame.scopes.pop(); }

  get(name: string) {
    const scopes = this.currentFrame.scopes;
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (name in scopes[i]) return scopes[i][name];
    }
    // Fallback to global frame if we are inside a function
    if (this.callStack.length > 1) {
      const globalScopes = this.callStack[0].scopes;
      for (let i = globalScopes.length - 1; i >= 0; i--) {
        if (name in globalScopes[i]) return globalScopes[i][name];
      }
    }
    return undefined;
  }

  set(name: string, value: any, declareLocal = false) {
    const scopes = this.currentFrame.scopes;
    if (declareLocal) {
      scopes[scopes.length - 1][name] = value;
      return;
    }
    for (let i = scopes.length - 1; i >= 0; i--) {
      if (name in scopes[i]) {
        scopes[i][name] = value;
        return;
      }
    }
    // Update global if it exists there
    if (this.callStack.length > 1) {
      const globalScopes = this.callStack[0].scopes;
      for (let i = globalScopes.length - 1; i >= 0; i--) {
        if (name in globalScopes[i]) {
          globalScopes[i][name] = value;
          return;
        }
      }
    }
    scopes[scopes.length - 1][name] = value; // Fallback to current local
  }

  getSnapshot() {
    const heap: Record<string, any> = {};
    const serializedStack = [];

    const serializeValue = (val: any): any => {
      if (val === null || val === undefined) return val;
      if (typeof val === 'function' || val.__isFunctional) return '[Function]';
      if (typeof val === 'object') {
        if (!this.objectMap.has(val)) {
          this.objectMap.set(val, `0x${this.objectIdCounter.toString(16)}`);
          this.objectIdCounter++;
        }
        const ref = this.objectMap.get(val)!;
        
        // Deep clone into heap if not already there
        if (!heap[ref]) {
          const converted: any = {};
          heap[ref] = converted; // Set early to break circular dependency infinite loops
          
          if (Array.isArray(val)) {
             converted.__type = 'array';
             for(let i=0; i<val.length; i++) {
                converted[i] = typeof val[i] === 'object' && val[i] !== null ? { __ref: serializeValue(val[i]).__ref } : typeof val[i] === 'function' ? '[Function]' : val[i];
             }
          } else {
             converted.__type = 'object';
             for (const k in val) {
                if(k === '__isFunctional' || k === 'node') continue; // hide ast payload
                converted[k] = typeof val[k] === 'object' && val[k] !== null ? { __ref: serializeValue(val[k]).__ref } : typeof val[k] === 'function' ? '[Function]' : val[k];
             }
             if (val.__className) {
                converted.__className = val.__className;
             }
          }
        }
        return { __ref: ref };
      }
      return val;
    };

    for (const frame of this.callStack) {
      const mergedLocals = Object.assign({}, ...frame.scopes);
      const safeLocals: Record<string, any> = {};
      
      for (const k in mergedLocals) {
         safeLocals[k] = serializeValue(mergedLocals[k]);
      }
      serializedStack.push({
         funcName: frame.funcName,
         locals: safeLocals
      });
    }

    // Return legacy variables from the top frame for UI compatibility
    return {
       callStack: serializedStack,
       heap,
       variables: serializedStack[serializedStack.length - 1]?.locals || {}
    };
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
      case 'ThisExpression':
        return state.currentFrame.thisContext;
      case 'Identifier':
        return state.get(expr.name);
      case 'ArrayExpression': {
        const arr = [];
        for (const el of expr.elements) {
          arr.push(yield* evaluateExpression(el));
        }
        return arr;
      }
      case 'ObjectExpression': {
        const obj: Record<string, any> = {};
        for (const prop of expr.properties) {
          if (prop.type === 'ObjectProperty') {
            const key = prop.key.type === 'Identifier' ? prop.key.name : (prop.key.type === 'StringLiteral' ? prop.key.value : String(yield* evaluateExpression(prop.key)));
            const val = yield* evaluateExpression(prop.value as t.Expression);
            obj[key] = val;
          }
        }
        return obj;
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
      case 'LogicalExpression': {
        const left = yield* evaluateExpression(expr.left as t.Expression);
        if (expr.operator === '&&') {
          if (!left) return left;
          return yield* evaluateExpression(expr.right);
        }
        if (expr.operator === '||') {
          if (left) return left;
          return yield* evaluateExpression(expr.right);
        }
        return undefined;
      }
      case 'UnaryExpression': {
        const arg = yield* evaluateExpression(expr.argument);
        switch (expr.operator) {
          case '!': return !arg;
          case '-': return -arg;
          case '+': return +(arg as number);
          case 'typeof': return typeof arg;
          case 'void': return void arg;
        }
        return undefined;
      }
      case 'NewExpression': {
        const args: any[] = [];
        for (const arg of expr.arguments) {
          args.push(yield* evaluateExpression(arg as t.Expression));
        }
        
        if (expr.callee.type === 'Identifier') {
          const className = expr.callee.name;
          const classDef = state.get(className);
          
          if (classDef && classDef.__isClass) {
            // Create a new empty object for the instance
            const newObj: any = { __className: className };
            
            // Find constructor
            const classBody = classDef.node.body.body;
            const constructorMethod = classBody.find((m: any) => m.kind === 'constructor');
            
            if (constructorMethod) {
               state.pushFrame(className + ' (constructor)', newObj);
               constructorMethod.params.forEach((p: any, i: number) => {
                 if (p.type === 'Identifier') state.set(p.name, args[i], true);
               });
               yield* executeNode(constructorMethod.body);
               state.hasReturned = false;
               state.returnValue = undefined;
               state.popFrame();
            }
            return newObj;
          }
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
            state.pushFrame(expr.callee.name);
            func.node.params.forEach((p: any, i: number) => {
              if (p.type === 'Identifier') state.set(p.name, args[i], true);
            });
            // Execute function body
            yield* executeNode(func.node.body);
            const ret = state.returnValue;
            state.hasReturned = false;
            state.returnValue = undefined;
            state.popFrame();
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
          
          // Execute Simulated Class Methods
          if (obj && obj.__className) {
            const classDef = state.get(obj.__className);
            if (classDef && classDef.__isClass) {
              const classBody = classDef.node.body.body;
              const method = classBody.find((m: any) => m.key.type === 'Identifier' && m.key.name === prop);
              if (method) {
                state.pushFrame(`${obj.__className}.${prop}`, obj);
                method.params.forEach((p: any, i: number) => {
                  if (p.type === 'Identifier') state.set(p.name, args[i], true);
                });
                yield* executeNode(method.body);
                const ret = state.returnValue;
                state.hasReturned = false;
                state.returnValue = undefined;
                state.popFrame();
                return ret;
              }
            }
          }
          
          // Fallback native bound calls
          if (obj && typeof obj[prop] === 'function') {
             // like arr.push()
            let ret;
            // Native array push updates length and mutations. 
            // the `obj` reference is directly manipulated.
            if (prop === 'push' || prop === 'pop' || prop === 'shift' || prop === 'unshift' || prop === 'splice') {
               const snapBefore = state.getSnapshot();
               yield { type: 'STEP', nodeId: getNodeId(expr), ...snapBefore };
               ret = obj[prop](...args);
               const snap = state.getSnapshot();
               yield { type: 'STEP', nodeId: getNodeId(expr), ...snap };
            } else {
               ret = obj[prop](...args);
            }
            return ret;
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
      const snap = state.getSnapshot();
      yield { type: 'STEP', nodeId: getNodeId(n), ...snap } as StepEvent;
    };

    switch (node.type) {
      case 'ClassDeclaration': {
        yield* announceNode();
        if (node.id) {
          state.set(node.id.name, { __isClass: true, node }, true);
        }
        const snap = state.getSnapshot();
        yield { type: 'STEP', nodeId: getNodeId(node), ...snap };
        break;
      }
      case 'FunctionDeclaration': {
        yield* announceNode();
        if (node.id) {
          state.set(node.id.name, { __isFunctional: true, node }, true);
        }
        const snap = state.getSnapshot();
        yield { type: 'STEP', nodeId: getNodeId(node), ...snap };
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
        const snap = state.getSnapshot();
        yield { type: 'STEP', nodeId: getNodeId(node), ...snap };
        break;
      }
      case 'ExpressionStatement': {
        yield* announceNode();
        yield* evaluateExpression(node.expression);
        const snap = state.getSnapshot();
        yield { type: 'STEP', nodeId: getNodeId(node), ...snap };
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
            const snap = state.getSnapshot();
            yield { type: 'STEP', nodeId: getNodeId(node.update), ...snap };
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

  const snapStart = state.getSnapshot();
  yield { type: 'STEP', nodeId: 'start', ...snapStart };
  for (const stmt of ast.program.body) {
    yield* executeNode(stmt);
    if (state.hasReturned) break; // Should not happen at top level, but safe
  }
  const snapEnd = state.getSnapshot();
  yield { type: 'STEP', nodeId: 'end', ...snapEnd };
  yield { type: 'END' };
}
