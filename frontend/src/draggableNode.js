// draggableNode.js

export const DraggableNode = ({ type, label }) => {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-item"
      draggable
      onDragStart={onDragStart}
    >
      {label}
    </div>
  );
};
  