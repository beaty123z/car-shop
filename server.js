const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
    let pathname = url.parse(req.url).pathname;
    
    // Default to index.html
    if (pathname === '/') {
        pathname = '/index.html';
    }

    // Security: prevent directory traversal
    pathname = pathname.replace(/\.\./g, '');
    
    const filePath = path.join(__dirname, pathname);

    // Check if file exists
    fs.stat(filePath, (err, stats) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 - File Not Found</h1>');
            return;
        }

        if (stats.isDirectory()) {
            const indexPath = path.join(filePath, 'index.html');
            fs.stat(indexPath, (err) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end('<h1>404 - Index Not Found</h1>');
                } else {
                    serveFile(indexPath, res);
                }
            });
        } else {
            serveFile(filePath, res);
        }
    });
});

function serveFile(filePath, res) {
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'text/plain';

    const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
    };

    contentType = mimeTypes[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end('<h1>500 - Server Error</h1>');
            return;
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
}

server.listen(PORT, () => {
    console.log(`CarShop server running on http://0.0.0.0:${PORT}`);
});
