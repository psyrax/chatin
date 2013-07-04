var express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server),
sanitizer = require('sanitizer'),
Moniker = require('moniker'),
counter = 0,
http = require('http'),
dateFormat = require('dateformat');
var lastMessages = [];


server.listen(1337);


app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');

});

io.sockets.on('connection', function (socket) {

  socket.on('room', function(room) {
    socket.join(room);

    counter ++;

    socket.emit('nickname', makeName() );

    socket.emit('backlog', {
      'backLog' : lastMessages,
      'total' : counter
    });
    
  });

  socket.on('changeNick', function() {
    socket.emit('nickname', makeName() );
  });

  socket.on('disconnect', function(){
    if ( counter > 0)
    {
       counter --;
    }

  });



  socket.on('transmit', function(data){

    var selroom = data.room;
    var usermensaje = sanitizer.sanitize(data.userMensaje);
    var userNick = sanitizer.sanitize(data.userNick);
    var userColor = sanitizer.sanitize(data.userColor);
    var now = new Date()
    var nowMX = now.setHours( now.getHours() - 5 );
    var dated = dateFormat(nowMX, "h:MM:ss TT");

    var mensaje = {
      'mensaje': usermensaje,
      'from': {'username': userNick, 'color': sanitizer.sanitize(userColor) },
      'date': dated,
      'total': counter
    };

    if ( lastMessages.length > 10 )
    {
      lastMessages.shift();
    }

    lastMessages.push( mensaje );

    socket.in(selroom).broadcast.emit('message' , mensaje);

    socket.in(selroom).emit('userMessage', mensaje);
  });

  function makeName()
  {
    var nickData = { 
      'nickname': sanitizer.sanitize(Moniker.choose()),
      'color' : Math.floor(Math.random()*11)
    }
    return nickData;
  }

});
