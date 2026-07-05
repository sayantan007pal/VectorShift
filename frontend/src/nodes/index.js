// index.js - exports all node components

import { BaseNode } from './BaseNode';
import { 
  inputNodeConfig, 
  outputNodeConfig, 
  llmNodeConfig,
  noteNodeConfig,
  mathNodeConfig,
  timerNodeConfig,
  loggerNodeConfig,
  joinNodeConfig
} from './nodeConfigs';
import { TextNode } from './textNode';

// Create node components from configs
export const InputNode = (props) => <BaseNode {...props} config={inputNodeConfig} />;
export const OutputNode = (props) => <BaseNode {...props} config={outputNodeConfig} />;
export const LLMNode = (props) => <BaseNode {...props} config={llmNodeConfig} />;
export const NoteNode = (props) => <BaseNode {...props} config={noteNodeConfig} />;
export const MathNode = (props) => <BaseNode {...props} config={mathNodeConfig} />;
export const TimerNode = (props) => <BaseNode {...props} config={timerNodeConfig} />;
export const LoggerNode = (props) => <BaseNode {...props} config={loggerNodeConfig} />;
export const JoinNode = (props) => <BaseNode {...props} config={joinNodeConfig} />;

// TextNode is special - has dynamic handles
export { TextNode };

// All node types for ReactFlow
export const nodeTypes = {
  customInput: InputNode,
  customOutput: OutputNode,
  llm: LLMNode,
  text: TextNode,
  note: NoteNode,
  math: MathNode,
  timer: TimerNode,
  logger: LoggerNode,
  join: JoinNode,
};
