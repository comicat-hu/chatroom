var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var ejs = require('ejs');
var config = require('./config.json');

var app = express();

//express settings
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

//route
app.get('/', (req, res) => {
    res.render('index');
});

//create socketio server
var server = http.createServer(app);
var io = socketio(server);

//listen http server
server.listen(config.port, () => {
    console.log('Run server at ' + config.host + ':' + config.port + ' - ' + new Date());
});
io.on('connection', function(socket) {

    console.log(socket.id + ' connect ' + new Date().toLocaleString());

    socket.on('clientTest', function(msg){
        console.log(socket.id + ' ' + msg)
        socket.emit('testOK', '200 OK');
    });

    socket.on('message', function(msg){
        console.log(socket.id + ' send: ' + msg);

        io.emit('broadcast', socket.id + ': ' + htmlCharConvert(msg));
    });

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnect' + new Date().toLocaleString());
    });
});

function htmlCharConvert(str){
    return str.replace(/&/g, "&amp;")
            .replace(/>/g, "&gt;")
            .replace(/</g, "&lt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}