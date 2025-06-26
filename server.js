const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
};

// Store RSVPs in memory (in production, use a database)
let rsvps = [];

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // Enable CORS for all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Handle RSVP submission
    if (pathname === '/api/rsvp' && req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const rsvpData = JSON.parse(body);
                
                // Add timestamp
                rsvpData.timestamp = new Date().toISOString();
                rsvpData.date = new Date().toLocaleDateString('de-DE');
                rsvpData.time = new Date().toLocaleTimeString('de-DE');
                
                // Store RSVP
                rsvps.push(rsvpData);
                
                // Save to file for persistence
                fs.writeFileSync(
                    path.join(__dirname, 'rsvps.json'), 
                    JSON.stringify(rsvps, null, 2)
                );
                
                console.log('Neue RSVP erhalten:', rsvpData);
                console.log(`Aktuelle Anzahl RSVPs: ${rsvps.length}`);
                
                // Send success response
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'RSVP erfolgreich gespeichert!' 
                }));
                
            } catch (error) {
                console.error('Fehler beim Verarbeiten der RSVP:', error);
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: 'Fehler beim Speichern der RSVP' 
                }));
            }
        });
        
        return;
    }
    
    // Handle RSVP list request (for party organizer)
    if (pathname === '/api/rsvps' && req.method === 'GET') {
        const yesResponses = rsvps.filter(rsvp => rsvp.response === 'yes');
        const noResponses = rsvps.filter(rsvp => rsvp.response === 'no');
        
        const summary = {
            total: rsvps.length,
            yes: yesResponses.length,
            no: noResponses.length,
            rsvps: rsvps
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(summary, null, 2));
        return;
    }
    
    // Serve static files
    let filePath = pathname === '/' ? '/index.html' : pathname;
    filePath = path.join(__dirname, filePath);
    
    // Security check - prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        // Get file extension and MIME type
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = mimeTypes[ext] || 'application/octet-stream';
        
        // Read and serve file
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(data);
        });
    });
});

// Load existing RSVPs on server start
try {
    const rsvpFile = path.join(__dirname, 'rsvps.json');
    if (fs.existsSync(rsvpFile)) {
        const data = fs.readFileSync(rsvpFile, 'utf8');
        rsvps = JSON.parse(data);
        console.log(`${rsvps.length} bestehende RSVPs geladen.`);
    }
} catch (error) {
    console.log('Keine bestehenden RSVPs gefunden, starte mit leerer Liste.');
}

// Start server
server.listen(PORT, () => {
    console.log('🎉 Nadjas Party Einladungs-Server gestartet!');
    console.log(`🌐 Server läuft auf: http://localhost:${PORT}`);
    console.log(`📋 RSVPs anzeigen: http://localhost:${PORT}/api/rsvps`);
    console.log('');
    console.log('Drücke Ctrl+C zum Beenden.');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Server wird beendet...');
    
    // Save RSVPs one last time
    try {
        fs.writeFileSync(
            path.join(__dirname, 'rsvps.json'), 
            JSON.stringify(rsvps, null, 2)
        );
        console.log('✅ RSVPs gespeichert.');
    } catch (error) {
        console.error('❌ Fehler beim Speichern der RSVPs:', error);
    }
    
    server.close(() => {
        console.log('👋 Server beendet. Bis bald!');
        process.exit(0);
    });
});

// Export for potential use in other modules
module.exports = { server, rsvps };
