const socket = io();

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')

function sendMessage() {
  console.log(messageInput.value)
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }

  socket.emit('message', data);
  addMessageToUi(true, data);
  messageInput.value = '';
}

socket.on('chat-message', (data) => {
  console.log(data);
  addMessageToUi(false, data);
})


messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  sendMessage()
})

function addMessageToUi(isOwnMessage, data) {
  if (isOwnMessage) {
    messageContainer.innerHTML += `
      <li class="message-right">
        <p class="message">
          ${data.message}
          <span><b>${data.name}</b> ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
    `
  } else {
    messageContainer.innerHTML += `
      <li class="message-left">
        <p class="message">
          ${data.message}
          <span><b>${data.name}</b> ${moment(data.dateTime).fromNow()}</span>
        </p>
      </li>
    `
  }
}

//To update total clients that connect
socket.on('clients-total', (data) => {
  clientsTotal.innerHTML = `Total clients: ${data}`
})
