$(document).foundation();
$(document).ready(function(){

	chatSize();
	$(window).resize(function(){
		chatSize();
	})
	var socket = io.connect('http://psyrax-nodechat.jit.su/');
 	var userRoom = 'Chatin';
 	var userNickname;
	socket.on('connect', function() {
   		// Connected, let's sign-up for to receive messages for this room
   		socket.emit('room', userRoom);
   		$('#chat').append('<p>Entrando a cuarto: ' + userRoom + '</p>');
   		
	});
	socket.on('message', function(data) {
		$('#chat').append('<p>' + data.from + ': ' + data.mensaje + '</p>');
		$('#chat').animate({ scrollTop: $('#chat').height()}, 1000);
	});

	socket.on('nickname', function(data){
		userNickname = data.nickname;
		$('#nickEcho').html('<h6 class="subheader">Tu eres ' + userNickname + ' :</h6>');
	})

	socket.on('userMessage', function(data) {
		$('#chat').append('<p>Tu: ' + data.mensaje + '</p>');
		$('#chat').animate({ scrollTop: $('#chat').height()}, 1000);
	});
	$('#toSend').keyup(function(e){
		if(e.keyCode == 13)
		{
  			var sendMessage = $('#toSend').val();
			$('#toSend').val('');
			socket.emit('transmit', { 'room': userRoom, 'userMensaje': sendMessage, 'userNick': userNickname });
		}
	});
	function chatSize()
	{
		var altura = $(window).height() - 150;
		$('#chat').height(altura);
	}
})