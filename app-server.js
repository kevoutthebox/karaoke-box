var express = require('express');
var _ = require('underscore');
var app = express();

var connections = [];
var roomTitle = 'Karaoke Room Name';
var singersInRoom = [];
var messageList = [];

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

	socket.once('disconnect', function() {

		// takes an array and returns the item in array that queries the parameters
		var member = _.findWhere(singersInRoom, {id: this.id});

		if (member) {
			singersInRoom.splice(singersInRoom.indexOf(member), 1);
			io.sockets.emit('updateSingers', singersInRoom);
		}

		connections.splice(connections.indexOf(socket), 1);
		socket.disconnect();
		console.log('Singer left ' + connections.length + ' remaining in the room.');
	});

	socket.on('enter', function(payload){
		var newSinger = {
			// this refers to our current socket
			id: this.id,
			name: payload.name
		}

		this.emit('entered', newSinger);

		singersInRoom.push(newSinger);
		// refers to every socket that we want to emit broadcast
		io.sockets.emit('updateSingers', singersInRoom);
	});

	socket.on('sendMessage', function(payload){
		var newMessageEntry = {
			name: payload.name,
			message: payload.message
		}

		messageList.push(newMessageEntry);

		io.sockets.emit('updateMessages', messageList);
	});

	socket.emit('welcome', {
		roomTitle: roomTitle
	});

	connections.push(socket);
});

console.log("Karaoke server is running at 'http://localhost:3000'");
