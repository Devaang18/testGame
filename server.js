
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { measureMemory } = require('vm');
const { createBrotliCompress } = require('zlib');

const app = express();

const clientPath = `${__dirname}/`;
console.log(`Serving static from ${clientPath}`);

app.use(express.static(clientPath));

const server = http.createServer(app);

const io = socketio(server);

const rooms = [];

io.on('connection', (sock) => {
    console.log(sock.id);

    sock.emit('message', 'Hi, you are connected');

    /*sock.on('message', (text) => {
        sock.broadcast.emit('message', text);
    });*/
    

    sock.on('join-room', (room, cb) => {
        sock.join(room);
        if (room === ""){
            cb('Enter Valid Room');
        }
        else if (rooms.includes(room)) {
            cb(`Joined ${room}`);
            io.in(room).emit('message', `${sock.id} joined`);
            sock.emit('server-client');
        }
        else {
            sock.emit('message', 'Rooms does not exist!');
        }
    });

    sock.on('create-room', (room, cb) => {
        sock.join(room);
        if (room === ""){
            cb('Enter Valid Room');
        }
        else {
            cb(`Created and Joined ${room}`);
            sock.emit('server-client');
            rooms.push(room);
        }
    });

    sock.on('flood', () =>{
       sock.broadcast.emit('message', `${sock.id} got Flooded.`);
    });
});

server.on('error', (err) => {
    console.error('Server error', err);
});

server.listen(process.env.PORT || 8080);
