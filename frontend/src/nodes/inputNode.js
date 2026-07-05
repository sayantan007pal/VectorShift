// inputNode.js

import { BaseNode } from './BaseNode';
import { inputNodeConfig } from './nodeConfigs';

export const InputNode = (props) => {
  return <BaseNode {...props} config={inputNodeConfig} />;
}
