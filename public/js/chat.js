const socket = io();

const chatHeader = document.getElementById('chat-header');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const messages = document.getElementById('messages');

chatBody.style.display = 'none';

chatHeader.addEventListener('click', () => {
  chatBody.style.display = chatBody.style.display === 'none' ? 'flex' : 'none';
});

function addMessage(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.textContent = msg.text;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

socket.on('load messages', msgs => {
  messages.innerHTML = '';
  msgs.forEach(msg => addMessage(msg));
});

socket.on('chat message', msg => addMessage(msg));

function sendMessage() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  socket.emit('chat message', msg);
  chatInput.value = '';
}

chatInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});
if (sendButton) sendButton.addEventListener('click', sendMessage);
