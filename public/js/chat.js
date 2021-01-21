const socket = io();

socket.on('message', (message) => {
  console.log(message);
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.querySelector('#message').value;
  console.log('Message Sent');
  socket.emit('sendMsg', message);
});

document.querySelector('#share-location').addEventListener('click', () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    const location = `User shared current location: https://google.com/maps?q=${lat},${lon}.`;

    socket.emit('sendLocation', location);
  });
});
