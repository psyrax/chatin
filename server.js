var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
sanitizer = require('sanitizer'),
Moniker = require('moniker'),
counter = 0,
http = require('http'),
dateFormat = require('dateformat')

server.listen(1337);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');

});

io.sockets.on('connection', function (socket) {

  socket.on('room', function(room) {
    socket.join(room);
    socket.emit('nickname', { nickname: sanitizer.sanitize(Moniker.choose()) });
    counter ++;
  });

  socket.on('changeNick', function() {
    socket.emit('nickname', { nickname: sanitizer.sanitize(Moniker.choose()) });
  });

  socket.on('disconnect', function(){
    if ( counter > 0)
    {
       counter --;
    }

  });



  socket.on('transmit', function(data){

    var selroom = data.room;
    var usermensaje = data.userMensaje;
    var userNick = data.userNick;
    var now = new Date()
    var dated = dateFormat(now, "h:MM:ss TT");

    socket.in(selroom).broadcast.emit('message' ,{
      'mensaje': sanitizer.sanitize(usermensaje),
      'from': sanitizer.sanitize(userNick),
      'date': dated,
      'total': counter
    });

    socket.in(selroom).emit('userMessage', {
      'mensaje': sanitizer.sanitize(usermensaje),
      'date': dated,
      'total': counter
    });
  });

});
