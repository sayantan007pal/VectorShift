// BaseNode.js

import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionMap = {
  Left: Position.Left,
  Right: Position.Right,
};

export const BaseNode = ({ id, data, config }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleChange = (fieldName, value) => {
    updateNodeField(id, fieldName, value);
  };

  return (
    <div className={`base-node ${data.nodeType}`}>
      <div className="node-header">
        <span>{config.title}</span>
      </div>
      <div className="node-body">
        {config.fields.map((field) => {
          const value = data[field.name] !== undefined ? data[field.name] : field.defaultValue;

          if (field.type === 'select') {
            return (
              <label key={field.name}>
                <span>{field.label}:</span>
                <select
                  value={value}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </label>
            );
          }

          return (
            <label key={field.name}>
              <span>{field.label}:</span>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(field.name, e.target.value)}
              />
            </label>
          );
        })}
      </div>

      {config.handles.map((handle) => {
        const samePositionHandles = config.handles.filter(h => h.position === handle.position);
        const indexOnSide = samePositionHandles.indexOf(handle);
        const total = samePositionHandles.length;
        const offset = total > 1 ? ((indexOnSide + 1) / (total + 1)) * 100 : 50;

        return (
          <Handle
            key={handle.id}
            type={handle.type}
            position={positionMap[handle.position]}
            id={`${id}-${handle.id}`}
            style={{ top: `${offset}%` }}
          />
        );
      })}
    </div>
  );
};
