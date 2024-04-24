const socket = require("socket.io")(server);

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageTone = new Audio('message-tone.mp3')

socket.on('chat-message', (data) => {
  messageTone.play()
  addMessageToUi(false, data);
})

//To update total clients that connect
socket.on('clients-total', (data) => {
  clientsTotal.innerHTML = `Total clients: ${data}`
})

messageForm.addEventListener('submit', (event) => {
  event.preventDefault()
  sendMessage()
})

function addMessageToUi(isOwnMessage, data) {
  clearFeedback()
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

  scrollToBottom();
}

function sendMessage() {
  if (!messageInput.value) {
    return
  }
  console.log(messageInput.value)
  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date()
  }

  socket.emit('message', data);
  addMessageToUi(true, data);
  messageInput.value = '';
  scrollToBottom();
}

function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

//Typing feature
messageInput.addEventListener('focus', (event) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message`
  })
})

messageInput.addEventListener('keypress', (event) => {
  socket.emit('feedback', {
    feedback: `${nameInput.value} is typing a message`
  })
})

messageInput.addEventListener('blur', (event) => {
  socket.emit('feedback', {
    feedback: ''
  })
})

socket.on('feedback', (data) => {
  clearFeedback()
  const message = `
    <li  class="message_feedback">
      <p class="feedback" id="feedback">${data.feedback}</p>
    </li>
  `
  messageContainer.innerHTML += message
})

function clearFeedback() {
  document.querySelectorAll('.message_feedback').forEach(element => {
    element.parentNode.removeChild(element)
  })
}