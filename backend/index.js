import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import util from 'util';
const app = express();
const execPromise = util.promisify(exec);

const pythonPath = process.env.PYTHON_PATH || 'py';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define accepted formats
const ACCEPTED_IMAGE_FORMATS = ['.jpg', '.jpeg', '.png', '.bmp', '.tiff'];
const ACCEPTED_FORMATS_STRING = 'JPG, JPEG, PNG, BMP, TIFF';

const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Content-Security-Policy'],
}));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " +
        "img-src 'self' data: blob:; " +
        "connect-src 'self' http://localhost:5000 ws://localhost:5173; " +
        "font-src 'self'; " +
        "frame-src 'self'; " +
        "worker-src 'self' blob:"
    );
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Function to validate file formats
function validateFileFormats(files) {
    const invalidFiles = [];
    const validFiles = [];

    for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase();
        const isValidFormat = ACCEPTED_IMAGE_FORMATS.includes(ext);

        if (isValidFormat) {
            validFiles.push(file);
        } else {
            invalidFiles.push({
                name: file.originalname,
                extension: ext || 'no extension',
                size: file.size
            });
        }
    }

    return { validFiles, invalidFiles };
}

// POST /execute with code + optional files
app.post('/execute', upload.array('files'), async (req, res) => {
    let scriptPath = '';
    try {
        const code = req.body.code;
        if (!code) {
            return res.status(400).json({
                error: 'No code provided',
                output: ['Error: No Python code was provided']
            });
        }

        // Validate file formats if files are uploaded
        if (req.files && req.files.length > 0) {
            const { validFiles, invalidFiles } = validateFileFormats(req.files);

            if (invalidFiles.length > 0) {
                const errorMessages = [
                    '❌ FILE FORMAT ERROR:',
                    '',
                    `Accepted image formats: ${ACCEPTED_FORMATS_STRING}`,
                    '',
                    'Invalid files detected:'
                ];

                invalidFiles.forEach(file => {
                    errorMessages.push(`  • ${file.name} (${file.extension})`);
                });

                errorMessages.push(
                    '',
                    '📝 SOLUTIONS:',
                    '1. Convert your image to one of the accepted formats',
                    '2. Or update your Python code to handle your file format',
                    '',
                    '💡 Most image editing software can convert between formats.',
                    '   Online converters are also available for quick conversion.'
                );

                return res.status(400).json({
                    error: 'Invalid file format(s)',
                    output: errorMessages,
                    formatError: true,
                    invalidFiles: invalidFiles,
                    acceptedFormats: ACCEPTED_FORMATS_STRING
                });
            }

            // Update req.files to only include valid files
            req.files = validFiles;
        }

        const tempDir = path.join(__dirname, 'temp', Date.now().toString());
        fs.mkdirSync(tempDir, { recursive: true });

        // Save uploaded files (rename image to sample.jpg/png)
        if (req.files && req.files.length > 0) {
            const uploadedFiles = [];
            for (const file of req.files) {
                const ext = path.extname(file.originalname).toLowerCase();
                const isImage = ACCEPTED_IMAGE_FORMATS.includes(ext);
                const finalName = isImage ? `sample${ext}` : file.originalname;
                fs.writeFileSync(path.join(tempDir, finalName), file.buffer);
                uploadedFiles.push({ original: file.originalname, saved: finalName });
            }

            // Add file upload confirmation to output
            const confirmationMessages = [
                '✅ Files uploaded successfully:',
                ''
            ];
            uploadedFiles.forEach(file => {
                confirmationMessages.push(`  📁 ${file.original} → ${file.saved}`);
            });
            confirmationMessages.push('', '▶️ Running Python code...');
        }

        // Save script.py
        scriptPath = path.join(tempDir, 'script.py');
        fs.writeFileSync(scriptPath, code);

        // Run the code
        const { stdout, stderr } = await execPromise(
            `"${pythonPath}" "${scriptPath}"`,
            {
                cwd: tempDir,
                timeout: 10000,
                windowsHide: true
            }
        );

        const outputMessages = [];

        // Add file confirmation if files were uploaded
        if (req.files && req.files.length > 0) {
            const uploadedFiles = [];
            for (const file of req.files) {
                const ext = path.extname(file.originalname).toLowerCase();
                const finalName = ACCEPTED_IMAGE_FORMATS.includes(ext) ? `sample${ext}` : file.originalname;
                uploadedFiles.push({ original: file.originalname, saved: finalName });
            }

            outputMessages.push('✅ Files uploaded successfully:');
            uploadedFiles.forEach(file => {
                outputMessages.push(`  📁 ${file.original} → ${file.saved}`);
            });
            outputMessages.push('');
        }

        // Add Python execution output
        if (stdout) outputMessages.push(stdout);
        if (stderr) outputMessages.push(stderr);

        res.json({
            output: outputMessages.filter(Boolean),
            error: null
        });
    } catch (error) {
        const errorOutput = [
            `❌ Execution Error: ${error.message}`,
        ];

        if (error.stderr) {
            errorOutput.push('', '📋 Python Error Details:', error.stderr);
        }

        errorOutput.push(
            '',
            '🔧 Troubleshooting:',
            '• Make sure Python is installed and in your PATH',
            '• Check that all required Python packages are installed',
            '• Verify your code syntax is correct'
        );

        res.status(500).json({
            error: 'Execution failed',
            output: errorOutput
        });
    } finally {
        // Clean up temporary directory
        try {
            if (scriptPath) {
                fs.rmSync(path.dirname(scriptPath), { recursive: true, force: true });
            }
        } catch (e) {
            console.warn('Cleanup failed:', e.message);
        }
    }
});

// New endpoint to get accepted formats
app.get('/formats', (req, res) => {
    res.json({
        acceptedFormats: ACCEPTED_IMAGE_FORMATS,
        formatsString: ACCEPTED_FORMATS_STRING
    });
});

app.listen(5000, () => {
    console.log('Python runner listening on port 5000');
    console.log('Test health check at http://localhost:5000/health');
    console.log(`Accepted image formats: ${ACCEPTED_FORMATS_STRING}`);
});