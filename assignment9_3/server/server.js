const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enable CORS so your frontend can connect
app.use(cors());

// Setup Socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // React frontend
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('🟢 A user connected:', socket.id);

    // Listen for incoming messages
    socket.on('chat message', (msg) => {
        console.log('📨 Message received:', msg);
        io.emit('chat message', msg); // Broadcast to all users
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('🔴 A user disconnected:', socket.id);
    });
});

// Start server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
