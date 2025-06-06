import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

function MarkdownEditor({ content, onSave }) {
    const [value, setValue] = useState(content);

    return (
        <div>
            <MDEditor value={value} onChange={setValue} />
            <button
                onClick={() => onSave(value)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Save Changes
            </button>
        </div>
    );
}