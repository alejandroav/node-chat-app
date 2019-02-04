var socket = io();

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:MM');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
});

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:MM');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});
	$('#messages').append(html);
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