const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('websocket connected');

  socket.emit('message', 'Welcome to Dodo Communications.');

  socket.on('sendMsg', (message) => {
    io.emit('message', message);
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
