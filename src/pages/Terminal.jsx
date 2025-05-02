/* import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Terminal() {
    const [pyodide, setPyodide] = useState(null);
    const [code, setCode] = useState(""); // initially empty
    const [output, setOutput] = useState("Loading Pyodide...");
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const codeParam = searchParams.get("code");
        if (codeParam) {
            setCode(decodeURIComponent(codeParam));
        }
    }, [searchParams]);

    useEffect(() => {
        const loadPyodideAndPackages = async () => {
            const pyodideInstance = await window.loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/"
            });

            // Load required packages
            await pyodideInstance.loadPackage(["opencv-python", "matplotlib", "scikit-image"]);

            setPyodide(pyodideInstance);
            setLoading(false);
            setOutput("Pyodide is ready. You can run Python code now.");
        };
        loadPyodideAndPackages();
    }, []);

    const handleFileChange = async (e, filename) => {
        const file = e.target.files[0];
        if (!file || !pyodide) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            const arrayBuffer = event.target.result;
            const byteArray = new Uint8Array(arrayBuffer);
            pyodide.FS.writeFile(filename, byteArray);

            if (filename === "scene.png") setImage(URL.createObjectURL(file));
            if (filename === "template.png") setResult(URL.createObjectURL(file));

            setOutput(`${filename} uploaded successfully.`);
        };
        reader.readAsArrayBuffer(file);
    };


    const runCode = async () => {
        if (!pyodide) return;

        try {
            setLoading(true);
            const result = await pyodide.runPythonAsync(code);
            setOutput(result?.toString() || "Executed successfully.");

            try {
                const outputBytes = pyodide.FS.readFile("output.jpg");
                const blob = new Blob([outputBytes], { type: "image/jpeg" });
                setResult(URL.createObjectURL(blob));
            } catch {
                setResult(null);
            }
        } catch (err) {
            setOutput(`Error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h2 className="text-lg font-bold mb-2">Input Code:</h2>
                <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[300px] p-2 border rounded"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "scene.png")}
                    className="mt-2 block"
                />
                <label>Upload Template Image:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "template.png")}
                    className="mt-2 block"
                />


                <button
                    onClick={runCode}
                    disabled={loading}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
                >
                    Run Code
                </button>
                <div className="flex gap-5">
                    {image && (
                        <div className="mt-4">
                            <p className="font-semibold">Uploaded Image:</p>
                            <img src={image} alt="Uploaded" className="max-w-full max-h-64 mt-1 border" />
                        </div>
                    )}
                    {result && (
                        <div className="mt-4">
                            <p className="font-semibold">Processed Output Image:</p>
                            <img src={result} alt="Output" className="max-w-full max-h-64 mt-1 border" />
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h2 className="text-lg font-bold mb-2">Output:</h2>
                <pre className="p-4 bg-black text-white rounded min-h-[200px] whitespace-pre-wrap">
                    {output}
                </pre>


            </div>
        </div>
    );
}
 */