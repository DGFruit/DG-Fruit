import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(__dirname));

// For SPA routing, redirect all requests to SIGN IN.html if needed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'SIGN IN.html'));
});

app.listen(PORT, () => {
    console.log(`\n🚀 Server is running at http://localhost:${PORT}`);
    console.log(`📂 Serving files from: ${__dirname}\n`);
});
