const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

app.use(express.json());

const imagesDir = path.join(__dirname, 'images');
const publicDir = path.join(__dirname, 'public');

// Disable caching for static files
app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// Serve static files from the 'public' directory, except for index.html
app.use(express.static(publicDir, {
    index: false
}));

// Serve images from the 'images' directory
app.use('/images', express.static(imagesDir));

// Serve index.html with a timestamp
app.get('/', (req, res) => {
    fs.readFile(path.join(publicDir, 'index.html'), 'utf8')
        .then(html => {
            const timestamp = new Date().toISOString();
            html = html.replace('</body>', `<script>console.log("Server time: ${timestamp}")</script></body>`);
            res.send(html);
        })
        .catch(err => {
            console.error('Error reading index.html:', err);
            res.status(500).send('Error loading the page');
        });
});

app.get('/api/images', async (req, res) => {
    try {
        const files = await fs.readdir(imagesDir);
        const imageFiles = files.filter(file => 
            ['.jpg', '.jpeg', '.png', '.gif'].includes(path.extname(file).toLowerCase())
        );
        res.json(imageFiles);
    } catch (error) {
        res.status(500).json({ error: 'Error reading image directory' });
    }
});

app.get('/api/description/:imageName', async (req, res) => {
    const txtFileName = path.join(imagesDir, req.params.imageName.replace(/\.[^/.]+$/, ".txt"));
    try {
        const data = await fs.readFile(txtFileName, 'utf8');
        res.json({ description: data });
    } catch (error) {
        if (error.code === 'ENOENT') {
            res.json({ description: '' });
        } else {
            res.status(500).json({ error: 'Error reading description file' });
        }
    }
});

app.post('/api/save-description', async (req, res) => {
    const { imageName, description, prefix } = req.body;
    const txtFileName = path.join(imagesDir, imageName.replace(/\.[^/.]+$/, ".txt"));

    try {
        await fs.writeFile(txtFileName, `${prefix}\n${description}`);
        res.json({ message: 'Description saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error saving description' });
    }
});

const stopWords = [
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'his', 'her',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
    'with', 'i', 'you', 'your', 'we', 'they', 'them', 'their', 'this', 'these', 'those',
    'which', 'what', 'whose', 'who', 'whom', 'where', 'when', 'why', 'how'
];

app.get('/api/word-frequency', async (req, res) => {
    try {
        const files = await fs.readdir(imagesDir);
        const txtFiles = files.filter(file => path.extname(file).toLowerCase() === '.txt');
        
        let allWords = [];
        for (const file of txtFiles) {
            const content = await fs.readFile(path.join(imagesDir, file), 'utf8');
            const words = content.toLowerCase().match(/\b\w+\b/g) || [];
            allWords = allWords.concat(words);
        }

        const wordFrequency = {};
        allWords.forEach(word => {
            if (!stopWords.includes(word)) {
                wordFrequency[word] = (wordFrequency[word] || 0) + 1;
            }
        });

        const sortedWords = Object.entries(wordFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 30)
            .map(([word]) => word);

        res.json(sortedWords);
    } catch (error) {
        res.status(500).json({ error: 'Error analyzing word frequency' });
    }
});

function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const testServer = http.createServer();
        testServer.listen(startPort, () => {
            const port = testServer.address().port;
            testServer.close(() => resolve(port));
        });
        testServer.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
    });
}

async function startServer() {
    try {
        const port = await findAvailablePort(3210);
        server.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer();