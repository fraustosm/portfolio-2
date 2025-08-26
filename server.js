require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const MessageSchema = new mongoose.Schema({
  user: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Socket.io
io.on('connection', socket => {
  console.log('Usuario conectado');

  // Enviar mensajes previos
  Message.find().sort({ createdAt: 1 }).then(messages => {
    socket.emit('load messages', messages);
  });

  // Escuchar nuevos mensajes
  socket.on('chat message', msg => {
    const message = new Message({ user: 'Visitor', text: msg });
    message.save().then(() => {
      io.emit('chat message', message);
    });
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
