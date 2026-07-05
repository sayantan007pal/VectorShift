// llmNode.js

import { BaseNode } from './BaseNode';
import { llmNodeConfig } from './nodeConfigs';

export const LLMNode = (props) => {
  return <BaseNode {...props} config={llmNodeConfig} />;
}
