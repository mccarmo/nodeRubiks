var http = require("http"),
	express = require("express"),
    fs = require("fs"),
    socketio = require("socket.io");

var app = express(),
    server = http.createServer(app);

app.get('/', function (request, response) {
    fs.createReadStream('./pages/index.html').pipe(response)
})

app.get('/glMatrix-0.9.5.min.js', function (request, response) {
    fs.createReadStream('./pages/js/glMatrix-0.9.5.min.js').pipe(response)
})

app.get('/webgl-utils.js', function (request, response) {
    fs.createReadStream('./pages/js/webgl-utils.js').pipe(response)
})

app.get('/geraCubo.js', function (request, response) {
    fs.createReadStream('./pages/js/geraCubo.js').pipe(response)
})

app.get('/geraCubo.js', function (request, response) {
    fs.createReadStream('./pages/js/hammer .js').pipe(response)
})

app.get('/blue.png', function (request, response) {
    fs.createReadStream('./pages/img/blue.png').pipe(response)
})

app.get('/red.png', function (request, response) {
    fs.createReadStream('./pages/img/red.png').pipe(response)
})

app.get('/green.png', function (request, response) {
    fs.createReadStream('./pages/img/green.png').pipe(response)
})

app.get('/white.png', function (request, response) {
    fs.createReadStream('./pages/img/white.png').pipe(response)
})

app.get('/yellow.png', function (request, response) {
    fs.createReadStream('./pages/img/yellow.png').pipe(response)
})

app.get('/magent.png', function (request, response) {
    fs.createReadStream('./pages/img/magent.png').pipe(response)
})

app.get('/nocolor.png', function (request, response) {
    fs.createReadStream('./pages/img/nocolor.png').pipe(response)
})

var io = socketio.listen(server);

io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
	console.log("socket connected...")
})

server.listen(process.env.PORT || 8002,"127.0.0.1")
console.log("Server starded...")
