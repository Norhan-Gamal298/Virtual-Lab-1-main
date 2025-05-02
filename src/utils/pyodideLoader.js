// src/utils/pyodideLoader.js
let pyodideInstance = null;

export const loadPyodideInstance = async () => {
    if (pyodideInstance) return pyodideInstance;

    pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
    });

    // Load necessary packages
    await pyodideInstance.loadPackage(['matplotlib', 'numpy', 'opencv-python']);

    return pyodideInstance;
};
