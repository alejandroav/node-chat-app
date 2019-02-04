var socket = io();

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:MM');
	var li = $('<li></li>');
	li.text(`${formattedTime} - ${message.from}: ${message.text}`);
	$('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:MM');
	var li = $('<li></li>');
	var a = $('<a target="_blank">My current location</a>');	
	a.attr('href', message.url);
	li.text(`${formattedTime} - ${message.from}: `);
	li.append(a);
	$('#messages').append(li);
});

var messageTextBox = $('[name=message]');
$('#message-form').on('submit', function(e) {
	e.preventDefault();
	socket.emit('createMessage', {
		from: 'User',
		text: $('[name=message]').val()
	}, function() {
		messageTextBox.val('');
	});
});

var locationButton = $('#send-location');
locationButton.on('click', function() {
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser.');
	} else {
		locationButton.attr('disabled', 'disabled').text('Sending location');
		navigator.geolocation.getCurrentPosition(function(position) {
			locationButton.removeAttr('disabled').text('Send location');
			socket.emit('createLocationMessage', {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude
			});
		}, function() {
			locationButton.removeAttr('disabled').text('Send location');
			alert('Unable to fetch location.');
		});
	}
});