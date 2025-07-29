// Basic Express + Socket.io server setup
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store device info
    let deviceInfo = {};

    // Listen for device location updates
    socket.on('send-location', (data) => {
        // Save device info
        deviceInfo = {
            id: socket.id,
            name: data.name || 'Unknown Device',
            type: data.type || 'Unknown',
            lastSeen: data.lastSeen || Date.now(),
            latitude: data.latitude,
            longitude: data.longitude
        };
        // Send info to all clients
        io.emit('receive-location', deviceInfo);
    });

    socket.on('disconnect', () => {
        io.emit('user-disconnected', socket.id);
        console.log('User disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
