// Basic Express + Socket.io server setup
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import session from 'express-session';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configure session middleware
const sessionMiddleware = session({
    secret: 'realtime-device-tracking-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
});

app.use(sessionMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Simple user store (in production, use a database)
const users = new Map();
// Add demo user
users.set('demo', { username: 'demo', password: 'demo' });

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login.html');
    }
}

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple authentication - accept any username/password or check demo user
    if ((username === 'demo' && password === 'demo') || (username && password)) {
        // Store user in session
        req.session.user = { username };
        // Store/update user in our simple user store
        users.set(username, { username, password });
        res.redirect('/');
    } else {
        res.redirect('/login.html?error=Invalid credentials');
    }
});

// Logout route
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});

// Serve login page when not authenticated
app.get('/', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve static files from public directory (except index.html which is protected)
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io connection with session support
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    const session = socket.request.session;
    if (!session || !session.user) {
        socket.disconnect();
        return;
    }
    
    console.log('Authenticated user connected:', socket.id, 'Username:', session.user.username);

    // Store device info
    let deviceInfo = {};

    // Listen for device location updates
    socket.on('send-location', (data) => {
        // Only process if user has enabled location sharing
        if (!data.shareLocation) {
            return;
        }
        
        // Save device info
        deviceInfo = {
            id: socket.id,
            username: session.user.username,
            name: data.name || 'Unknown Device',
            type: data.type || 'Unknown',
            lastSeen: data.lastSeen || Date.now(),
            latitude: data.latitude,
            longitude: data.longitude,
            showOnMap: data.showOnMap || false
        };
        
        // Send info to all clients, but respect privacy settings
        if (data.showOnMap) {
            io.emit('receive-location', deviceInfo);
        } else {
            // Only send to other clients, not back to sender
            socket.broadcast.emit('receive-location', deviceInfo);
        }
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
