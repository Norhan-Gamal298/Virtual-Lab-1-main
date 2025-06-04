import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { runPythonCode } from '../services/pythonRunner';

export default function TerminalPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [output, setOutput] = useState([]);
    const [isRunning, setIsRunning] = useState(false);
    const [files, setFiles] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const encodedCode = params.get('code');

        if (!encodedCode) {
            setCode('# Welcome to the Python Terminal\n# Write your code here or import from lessons\nprint("Hello, World!")');
            return;
        }

        try {
            const decoded = decodeURIComponent(encodedCode.replace(/\+/g, ' '));
            setCode(decoded);
        } catch (error) {
            console.error('Decoding error:', error);
            setCode(encodedCode.replace(/\+/g, ' '));
        }
    }, [location]);

    const handleRunCode = async (e) => {
        e.preventDefault(); // ✅ Add this line to prevent page reload
        setIsRunning(true);
        setOutput(prev => [...prev, '$ python script.py']);
        setError(null);

        try {
            const result = await runPythonCode(code, files);
            if (result.error) {
                setOutput(prev => [...prev, `Error: ${result.error}`]);
                if (result.details) {
                    console.error('Error details:', result.details);
                }
            } else {
                setOutput(prev => [...prev, ...result.output]);
            }
        } catch (err) {
            setError(err.message);
            setOutput(prev => [...prev, `Execution Failed: ${err.message}`]);
        } finally {
            setIsRunning(false);
        }
    };


    // In TerminalPage.js handleFileUpload
    const handleFileUpload = (e) => {
        const fileList = e.target.files;
        Array.from(fileList).forEach(file => {
            // Use arrayBuffer instead of DataURL
            const reader = new FileReader();
            reader.onload = (e) => {
                setFiles(prev => ({
                    ...prev,
                    [file.name]: e.target.result // ArrayBuffer
                }));
            };
            reader.readAsArrayBuffer(file);
        });
    };

    const clearTerminal = () => {
        setOutput([]);
        setError(null);
    };

    const downloadOutput = () => {
        const blob = new Blob([output.join('\n')], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'output.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between mb-4 gap-2 flex-wrap">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                    Back to Lesson
                </button>
                <div className="flex gap-2">
                    <button
                        onClick={clearTerminal}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Clear Terminal
                    </button>
                    <button
                        onClick={downloadOutput}
                        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    >
                        Download Output
                    </button>
                </div>
            </div>

            <CodeEditor value={code} onChange={setCode} />

            <div className="flex gap-2 mt-4">
                <button
                    onClick={(e) => handleRunCode(e)}
                    disabled={isRunning}
                    className={`px-6 py-2 rounded ${isRunning ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'} text-white`}
                >
                    {isRunning ? 'Running...' : 'Run Code'}
                </button>
                {isRunning && (
                    <button
                        onClick={() => {/* Add cancel functionality later */ }}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Stop Execution
                    </button>
                )}
            </div>

            <div className="mt-4 bg-black text-green-400 p-4 rounded font-mono text-sm terminal-output">
                <div className="mb-2 flex justify-between items-center">
                    <h3 className="text-lg">Terminal Output:</h3>
                    <button
                        onClick={() => setOutput([])}
                        className="text-xs bg-gray-800 px-2 py-1 rounded"
                    >
                        Clear
                    </button>
                </div>
                <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                    {output.map((line, i) => {
                        if (line.startsWith('data:image')) {
                            return <img key={i} src={line} alt="Output" className="mt-4 max-w-full border border-gray-600" />;
                        }
                        return (
                            <div key={i} className={line.startsWith('Error') ? 'text-red-400' : ''}>
                                {line}
                            </div>
                        );
                    })}
                </pre>
                {output.some(line => line.startsWith('data:image')) && (
                    output.map((line, i) => line.startsWith('data:image') ? (
                        <img key={i} src={line} alt="Output" className="mt-4 max-w-full border border-gray-600" />
                    ) : null)
                )}
            </div>

            {error && (
                <div className="mt-4 bg-red-900/20 border-l-4 border-red-500 text-red-400 p-4 font-mono">
                    <p className="font-bold">ERROR:</p>
                    <p>{error}</p>
                    <p className="text-sm mt-2">
                        Make sure the Python execution service is running on port 5000
                    </p>
                </div>
            )}
        </div>
    );
}