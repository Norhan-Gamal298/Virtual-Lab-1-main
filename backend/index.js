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

        const tempDir = path.join(__dirname, 'temp', Date.now().toString());
        fs.mkdirSync(tempDir, { recursive: true });

        // Save uploaded files
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                fs.writeFileSync(path.join(tempDir, file.originalname), file.buffer);
            }
        }

        scriptPath = path.join(tempDir, 'script.py');
        fs.writeFileSync(scriptPath, code);

        const { stdout, stderr } = await execPromise(
            `"${pythonPath}" "${scriptPath}"`,
            {
                cwd: tempDir,
                timeout: 10000,
                windowsHide: true
            }
        );

        res.json({
            output: [stdout, stderr].filter(Boolean),
            error: null
        });
    } catch (error) {
        res.status(500).json({
            error: 'Execution failed',
            output: [
                `Error: ${error.message}`,
                error.stderr || '',
                'Make sure Python is installed and in your PATH'
            ]
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

app.listen(5000, () => {
    console.log('Python runner listening on port 5000');
    console.log('Test health check at http://localhost:5000/health');
});
