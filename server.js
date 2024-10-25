// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


function generateRoomId() {
    return Math.random().toString(36).substring(2, 7); // 5-character string
}


const PORT = 3000;

function startServer() {

io.on('connection', (socket) => {

    socket.on('authenticate-player', (data) => {
        console.log('authenticate-player',data.name)
    })

    socket.on('authenticate-admin', (data) => {
        console.log('authenticate-admin',data.name)
        
        createGame()
    })


    function createGame() {
        console.log('createGame')
        const roomId = generateRoomId(); // Generate a random room ID
        socket.join(roomId); // The client joins this room
    
        // Send the room ID back to the client
        socket.emit('roomCreated', { roomId: roomId });
        console.log(`Room created with ID: ${roomId}`);
    
    }
    
});


server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
}

module.exports = startServer;

