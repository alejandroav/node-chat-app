var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var from = 'user';
		var text = 'text';
		var message = generateMessage(from, text);	

		expect(message).toInclude({from, text});
		expect(message.createdAt).toBeA('number');
	});
});

describe('generateLocationMessage', () => {
	it('should generate correct location message', () => {
		var from = 'user';
		var lat = 123;
		var lon = 123;
		var url = 'https://google.com/maps?q=123,123';
		var message = generateLocationMessage(from, lat, lon);

		expect(message).toInclude({from, url});
		expect(message.createdAt).toBeA('number');
	});
});