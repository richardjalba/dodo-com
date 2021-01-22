const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMsg, generateLocationMsg } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  console.log('Websocket Connected.');

  socket.emit('message', generateMsg('Welcome to Dodo Comms Tool.'));
  socket.broadcast.emit(
    'message',
    generateMsg('A new user has joined the chat.')
  );

  socket.on('sendMsg', (message, callback) => {
    const filter = new Filter();

    if (filter.isProfane(message)) {
      return callback(
        'No Profanity Allowed! - Keep that between you and your mother.'
      );
    }

    io.emit('message', generateMsg(message));
    callback();
  });

  socket.on('sendLocation', (location) => {
    io.emit('locationMsg', generateLocationMsg(location));
  });

  socket.on('disconnect', () => {
    io.emit('message', generateMsg('A user has left the chat.'));
  });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
