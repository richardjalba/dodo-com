const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('websocket connected');

  socket.emit('message', 'Welcome to Dodo Communications.');
  socket.broadcast.emit('message', 'A new user has joined the chat.');

  socket.on('sendMsg', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback(
        'No Profanity Allowed! - Keep that between you and your mother.'
      );
    }

    io.emit('message', message);
    callback();
  });

  socket.on('sendLocation', (location) => {
    io.emit('locationMsg', location);
  });

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat.');
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
