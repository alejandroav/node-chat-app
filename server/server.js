const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
app.use(express.static(publicPath));

io.on('connection', (socket) => {

	socket.on('join', (params, callback) => {
		if (!isRealString(params.username) || !isRealString(params.room)) {
			callback('Display name and room name are required.');
		} else {
			socket.join(params.room);
			socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));
			socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.username} joined.`));
			callback();
		}
	});

	socket.on('createMessage', (message, callback) => {
		if (isRealString(message.text)) {
			io.emit('newMessage', generateMessage(message.from, message.text));
			callback();
		}
	});

	socket.on('createLocationMessage', (coords) => {
		io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
	});
});

server.listen(port, () => {
	console.log('Listening on port', port);
});