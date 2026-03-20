import { executeCode, StepEvent } from '../utils/executor';

let generator: AsyncGenerator<StepEvent> | null = null;

self.onmessage = async (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'START') {
    generator = executeCode(payload.code);
    postMessage({ type: 'STARTED' });
  } 
  else if (type === 'STEP') {
    if (!generator) return;
    
    try {
      const result = await generator.next();
      if (result.done) {
        postMessage({ type: 'END' });
        generator = null;
      } else {
        postMessage(result.value);
      }
    } catch (error: any) {
      postMessage({ type: 'ERROR', message: error.message });
      generator = null;
    }
  }
  else if (type === 'STOP') {
    generator = null;
    postMessage({ type: 'STOPPED' });
  }
};
