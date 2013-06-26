var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
sanitizer = require('sanitizer'),
Moniker = require('moniker'),
counter = 0;

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
    socket.in(selroom).broadcast.emit('message' ,
      { mensaje: sanitizer.sanitize(usermensaje),
        from: sanitizer.sanitize(userNick),
        total: counter });
    socket.in(selroom).emit('userMessage' ,{mensaje: sanitizer.sanitize(usermensaje), total: counter});
  });

});
