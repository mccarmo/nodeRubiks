var http = require("http"),
	express = require("express"),
    fs = require("fs"),
    socketio = require("socket.io");

var app = express(),
    server = http.createServer(app);

app.use(express.static(__dirname + '/pages'));
	
var io = socketio.listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
	console.log("socket connected...")
})

server.listen(process.env.PORT || 8002,"192.168.25.2");
console.log("Server starded...")
