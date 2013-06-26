var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs'),
sanitizer = require('sanitizer'),
Moniker = require('moniker'),
counter = 0;

app.listen(1337);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {

  socket.on('room', function(room) {
        socket.join(room);
        socket.emit('nickname', { nickname: sanitizer.sanitize(Moniker.choose()) });
        counter ++;
  });

  socket.on('disconnect', function(){
    counter --;
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