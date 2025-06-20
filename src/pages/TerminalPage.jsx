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
    const [acceptedFormats, setAcceptedFormats] = useState('JPG, JPEG, PNG, BMP, TIFF');

    // Fetch accepted formats on component mount
    useEffect(() => {
        const fetchFormats = async () => {
            try {
                const response = await fetch('http://localhost:5000/formats');
                const data = await response.json();
                setAcceptedFormats(data.formatsString);
            } catch (err) {
                console.warn('Could not fetch formats:', err);
            }
        };
        fetchFormats();
    }, []);

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
        e.preventDefault();
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

    const validateFileFormat = (file) => {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return allowedExtensions.includes(fileExtension);
    };

    const handleFileUpload = (e) => {
        const fileList = Array.from(e.target.files);
        const validFiles = [];
        const invalidFiles = [];

        fileList.forEach(file => {
            if (validateFileFormat(file)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file);
            }
        });

        // Show format error if invalid files detected
        if (invalidFiles.length > 0) {
            const errorMessage = [
                '❌ INVALID FILE FORMAT(S) DETECTED:',
                '',
                ...invalidFiles.map(file => `• ${file.name} (${file.name.substring(file.name.lastIndexOf('.')) || 'no extension'})`),
                '',
                `✅ Accepted formats: ${acceptedFormats}`,
                '',
                '💡 Please convert your files to an accepted format and try again.'
            ];

            setOutput(prev => [...prev, ...errorMessage]);
            return;
        }

        // Process valid files
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFiles(prev => ({
                    ...prev,
                    [file.name]: e.target.result
                }));
            };
            reader.readAsArrayBuffer(file);
        });

        // Show success message
        if (validFiles.length > 0) {
            const successMessage = [
                '✅ Files ready for upload:',
                ...validFiles.map(file => `• ${file.name}`),
                ''
            ];
            setOutput(prev => [...prev, ...successMessage]);
        }

        // Clear the input
        e.target.value = '';
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
                    <label className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer">
                        Upload Files
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            multiple
                            accept=".jpg,.jpeg,.png,.bmp,.tiff"
                        />
                    </label>
                    <button
                        onClick={clearTerminal}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
                    >
                        Clear Terminal
                    </button>
                </div>
            </div>

            {/* Format Information Card */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4 rounded">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <span className="text-blue-400 text-xl">ℹ️</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-blue-700">
                            <strong>Accepted Image Formats:</strong> {acceptedFormats}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                            Files will be automatically renamed to "sample.[extension]" for your Python code to access.<br />
                            You need to adjust the code to the uploaded file format.
                        </p>
                    </div>
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
                            <div key={i} className={
                                line.startsWith('❌') ? 'text-red-400' :
                                    line.startsWith('✅') ? 'text-green-400' :
                                        line.startsWith('Error') ? 'text-red-400' :
                                            line.startsWith('📁') || line.startsWith('•') ? 'text-blue-400' :
                                                line.startsWith('💡') || line.startsWith('🔧') ? 'text-yellow-400' : ''
                            }>
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
