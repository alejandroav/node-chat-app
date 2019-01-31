const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {
	console.log('New user connected');

	socket.on('disconnect', () => {
		console.log('User disconnected');
	});

	socket.emit('newMessage', {
		from: 'admin',
		text: 'Welcome to the chat',
		createdAt: new Date().getTime()
	});

	socket.broadcast.emit('newMessage', {
		from: 'admin',
		text: 'New user joined',
		createdAt: new Date().getTime()
	});

	socket.on('createMessage', (message) => {
		console.log(message);
		io.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		});
	});
});

server.listen(port, () => {
	console.log('Listening on port', port);
});