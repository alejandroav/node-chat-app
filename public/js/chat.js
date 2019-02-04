var socket = io();

function scrollToBottom() {
	// selectors
	var messages = $('#messages');
	var newMessage = messages.children('li:last-child');
	// heights
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:mm');
	var template = $('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});
	$('#messages').append(html);
	scrollToBottom();
});

socket.on('newLocationMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('HH:mm');
	var template = $('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		createdAt: formattedTime,
		url: message.url
	});
	$('#messages').append(html);
	scrollToBottom();
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