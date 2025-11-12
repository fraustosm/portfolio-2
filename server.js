require('dotenv').config();
const express = require('express');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta por defecto (opcional)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Puerto
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
