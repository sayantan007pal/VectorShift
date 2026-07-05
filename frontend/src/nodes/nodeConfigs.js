// nodeConfigs.js

// Input Node - accepts data into the pipeline
export const inputNodeConfig = {
  type: 'customInput',
  title: 'Input',
  handles: [
    { id: 'value', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'inputName', label: 'Name', type: 'text', defaultValue: '' },
    { name: 'inputType', label: 'Type', type: 'select', defaultValue: 'Text', options: ['Text', 'File'] }
  ]
};

// Output Node - displays output from the pipeline
export const outputNodeConfig = {
  type: 'customOutput',
  title: 'Output',
  handles: [
    { id: 'value', type: 'target', position: 'Left' }
  ],
  fields: [
    { name: 'outputName', label: 'Name', type: 'text', defaultValue: '' },
    { name: 'outputType', label: 'Type', type: 'select', defaultValue: 'Text', options: ['Text', 'Image'] }
  ]
};

// LLM Node - Language Model processing
export const llmNodeConfig = {
  type: 'llm',
  title: 'LLM',
  handles: [
    { id: 'system', type: 'target', position: 'Left' },
    { id: 'prompt', type: 'target', position: 'Left' },
    { id: 'response', type: 'source', position: 'Right' }
  ],
  fields: []
};

// Text Node - handled separately due to dynamic handles
export const textNodeConfig = {
  type: 'text',
  title: 'Text',
  handles: [
    { id: 'output', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'text', label: 'Text', type: 'textarea', defaultValue: '{{input}}' }
  ]
};

// ---- 5 New Demo Nodes ----

// Note Node - for comments/annotations
export const noteNodeConfig = {
  type: 'note',
  title: 'Note',
  handles: [],
  fields: [
    { name: 'content', label: 'Note', type: 'text', defaultValue: '' }
  ]
};

// Math Node - basic math operations
export const mathNodeConfig = {
  type: 'math',
  title: 'Math',
  handles: [
    { id: 'a', type: 'target', position: 'Left' },
    { id: 'b', type: 'target', position: 'Left' },
    { id: 'result', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'operation', label: 'Op', type: 'select', defaultValue: 'add', options: ['add', 'subtract', 'multiply', 'divide'] }
  ]
};

// Timer Node - triggers after interval
export const timerNodeConfig = {
  type: 'timer',
  title: 'Timer',
  handles: [
    { id: 'trigger', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'interval', label: 'Interval (ms)', type: 'text', defaultValue: '1000' }
  ]
};

// Logger Node - logs data
export const loggerNodeConfig = {
  type: 'logger',
  title: 'Logger',
  handles: [
    { id: 'input', type: 'target', position: 'Left' }
  ],
  fields: [
    { name: 'prefix', label: 'Prefix', type: 'text', defaultValue: '[LOG]' }
  ]
};

// Join Node - combines two inputs
export const joinNodeConfig = {
  type: 'join',
  title: 'Join',
  handles: [
    { id: 'input1', type: 'target', position: 'Left' },
    { id: 'input2', type: 'target', position: 'Left' },
    { id: 'output', type: 'source', position: 'Right' }
  ],
  fields: [
    { name: 'separator', label: 'Separator', type: 'text', defaultValue: ', ' }
  ]
};

// All configs in one object
export const nodeConfigs = {
  customInput: inputNodeConfig,
  customOutput: outputNodeConfig,
  llm: llmNodeConfig,
  text: textNodeConfig,
  note: noteNodeConfig,
  math: mathNodeConfig,
  timer: timerNodeConfig,
  logger: loggerNodeConfig,
  join: joinNodeConfig,
};
