// outputNode.js

import { BaseNode } from './BaseNode';
import { outputNodeConfig } from './nodeConfigs';

export const OutputNode = (props) => {
  return <BaseNode {...props} config={outputNodeConfig} />;
}
