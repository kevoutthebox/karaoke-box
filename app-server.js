var express = require('express');
var app = express();

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
    console.log("Connected: %s", socket.id);
});

console.log("Karaoke server is running at 'http://localhost:3000'");