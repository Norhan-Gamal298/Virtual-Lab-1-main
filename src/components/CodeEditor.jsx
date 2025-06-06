import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Configure Monaco loader path


export default function CodeEditor({ value, onChange }) {
    const [code, setCode] = useState(value);

    useEffect(() => {
        setCode(value);
    }, [value]);

    const handleEditorChange = (value) => {
        setCode(value);
        onChange(value);
    };

    return (
        <div className="border rounded overflow-hidden">
            <Editor
                height="60vh"
                defaultLanguage="python"
                value={code}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: true,
                    scrollBeyondLastColumn: 5,
                    readOnly: false,
                    contextmenu: true,
                }}
                beforeMount={() => {
                    // This helps with Monaco initialization
                    if (typeof window !== 'undefined') {
                        self.MonacoEnvironment = window.MonacoEnvironment;
                    }
                }}
            />
        </div>
    );
}