export async function runPythonCode(code, files) {
    try {
        const formData = new FormData();
        formData.append('code', code);

        // Handle file uploads properly
        if (files && Object.keys(files).length > 0) {
            Object.entries(files).forEach(([name, content]) => {
                if (content instanceof Blob) {
                    formData.append('files', content, name);
                } else if (typeof content === 'string' && content.startsWith('data:')) {
                    const blob = dataURLtoBlob(content);
                    formData.append('files', blob, name);
                } else {
                    formData.append('files', new Blob([content]), name);
                }
            });
        }

        const response = await fetch('http://localhost:5000/execute', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Execution failed:', error);
        return {
            error: error.message,
            output: [`Execution Error: ${error.message}`],
            details: error.stack
        };
    }
}

function dataURLtoBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
}