// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
	const server = express();
	const httpServer = http.createServer(server);
	const io = socketIo(httpServer);

	// Configurar CORS
	server.use(cors());

	// Configuración de Socket.io
	io.on('connection', (socket) => {
		console.log('Usuario conectado');

		socket.on('disconnect', () => {
			console.log('Usuario desconectado');
		});

		socket.on('signal', (data) => {
			socket.broadcast.emit('signal', {
				from: data.from,
				signal: data.signal,
			});
		});
	});

	// Rutas de Express
	server.all('*', (req, res) => {
		return handle(req, res);
	});

	const PORT = process.env.PORT || 3000;
	httpServer.listen(PORT, (err) => {
		if (err) throw err;
		console.log(`Servidor corriendo en http://localhost:${PORT}`);
	});
});
