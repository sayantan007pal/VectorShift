// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {
    return (
        <div className="toolbar">
            <DraggableNode type='customInput' label='Input' />
            <DraggableNode type='customOutput' label='Output' />
            <DraggableNode type='llm' label='LLM' />
            <DraggableNode type='text' label='Text' />
            <DraggableNode type='note' label='Note' />
            <DraggableNode type='math' label='Math' />
            <DraggableNode type='timer' label='Timer' />
            <DraggableNode type='logger' label='Logger' />
            <DraggableNode type='join' label='Join' />
        </div>
    );
};
