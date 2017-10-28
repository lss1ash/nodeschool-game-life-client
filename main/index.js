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
	socket = io(`https://localhost:8000/api?token=${token}`, {
    path: '/',
    transports: ['websocket'],
		// rejectUnauthorized: false,
		secure: true
  });
	addHandlers(socket);
};

function addHandlers(socket) {
	socket.on('connect', () => {
		console.log('Connection opened');
	});

	socket.on('reconnect', () => {
		// По-хорошему стоит просто чистить игровое поле
		console.log('Reconnecting...');
		window.location.reload(false);
	});

	socket.on('message', msg => {
		const message = JSON.parse(msg);
		processResp(message);
	});

	socket.on('error', e => {
		console.log(`Error occured: ${e}`);
	});

	socket.on('disconnect', e => {
		const wasClean = e.wasClean;
		console.log(`closing was clean: ${wasClean}`);
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
	game = new LifeGame(user, settings);
	game.init();
	game.setState(state);
	game.send = send;
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
