'use strict';

//
// YOUR CODE GOES HERE...
//
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░
// ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░
// ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░
// ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░
// ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░
// ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░
// ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░
// ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░
// ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░
// ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░
// ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░
// ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//
// Nyan cat lies here...
//

let game = null;
let socket = null;

App.onToken = (token) => {
	console.log(localStorage.getItem('lifeToken'));
	socket = io(`https://localhost:8000/api?token=${token}`, {
    path: '/',
    transports: ['websocket'],
		rejectUnauthorized: false,
		secure: true
  });
	addHandlers(socket);
};

function addHandlers(socket) {
	socket.on('connect', () => {
		console.log('Connection opened');
	});

	socket.on('reconnect', msg => {
		const message = JSON.parse(msg);
		processResp(message);
	});

	socket.on('message', msg => {
		const message = JSON.parse(msg);
		processResp(message);
	});

	socket.on('error', e => {
		console.log(`Error occured: ${e}`);
	});

	socket.on('disconnect', msg => {
		console.log(`Connection closed: ${msg}`);
	});
}

function processResp({type, data}) {
	switch (type) {
		case 'INITIALIZE':
			initGame(data);
			break;
		case 'UPDATE_STATE':
			update(data);
			break;
		default:
			console.log(`Undefined message type - ${type} with data - ${data}`);
			break;
	}
}

function initGame({state, settings, user}) {
	if (!game) {
		game = new LifeGame(user, settings);
		game.init();
		game.send = send;
	}
	game.setState(state);
}

function update(data) {
	game.setState(data);
}

function send(data) {
	const result = JSON.stringify({
		type: 'ADD_POINT',
		data
	});

	socket.send(result);
}

window.App.init();
