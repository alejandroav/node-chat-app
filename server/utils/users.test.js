const expect = require('expect');
const {Users} = require('./users');


describe('Users', () => {
	var users;

	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'Mike',
			room: 'Test 1'
		}, {
			id: '2',
			name: 'Andrew',
			room: 'Test 2'
		}, {
			id: '3',
			name: 'Jen',
			room: 'Test 1'
		}];
	});
	
	it('should add a user', () => {
		var users = new Users();
		var user = {id: '1', name: 'Alex', room: 'Test'};
		users.addUser(user.id, user.name, user.room);

		expect(users.users).toEqual([user]);
	});

	it('should remove a user', () => {
		var user = users.removeUser('1');

		expect(user.id).toEqual('1');
		expect(users).toNotContain(user);
		expect(users.users.length).toBe(2);
	});

	it('should not remove invalid user', () => {
		var user = users.removeUser('0');

		expect(users.users.length).toBe(3);		
		expect(user).toNotExist();
	});

	it('should find a user', () => {
		var user = users.getUser('1');
		
		expect(user.id).toBe('1');
	});
	
	it('should not find invalid user', () => {
		var user = users.getUser('0');

		expect(user).toNotExist();
	});

	it('should return names for test 1', () => {
		var userList = users.getUserList('Test 1');

		expect(userList).toEqual(['Mike', 'Jen']);
	});

	it('should return names for test 2', () => {
		var userList = users.getUserList('Test 2');

		expect(userList).toEqual(['Andrew']);
	});
});