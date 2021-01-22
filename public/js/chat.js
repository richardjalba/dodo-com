const socket = io();

// List of Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationShareButton = $messageForm.querySelector('#share-location');
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMsg', (url) => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url,
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();

  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = document.querySelector('#message').value;

  socket.emit('sendMsg', message, (err) => {
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus();

    if (err) {
      return console.log(err);
    }

    console.log('Message Delivered');
  });
});

$locationShareButton.addEventListener('click', () => {
  $locationShareButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition((position) => {
    const lon = position.coords.longitude;
    const lat = position.coords.latitude;

    const location = `User shared current location: https://google.com/maps?q=${lat},${lon}.`;

    $locationShareButton.removeAttribute('disabled');
    socket.emit('sendLocation', location);
  });
});
