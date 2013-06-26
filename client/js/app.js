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
   		$('#chatContent').append('<h5 class="subheader">Bienvenido a Chatin</h5>');

	});
	socket.on('message', function(data) {
		$('#chatContent').append('<p><span class="otrosDisplay">' + data.from + ':</span> ' + data.mensaje + '</p>');
		autoScroll();
		$('#info').html(' Hay ' + data.total + ' usuarios');
	});

	socket.on('nickname', function(data){
		userNickname = data.nickname;
		$('#nickEcho').html('<h6 class="subheader">Hola ' + userNickname + '</h6>');
	})

	socket.on('userMessage', function(data) {
		$('.lastCheck').remove();
		$('#chatContent').append('<p><span class="userDisplay ">T&uacute;:</span> ' + data.mensaje + ' <span class="lastCheck radius secondary label"> - &Uacute;ltimo update -</span></p>');
		autoScroll();
		$('#info').html(' Hay ' + data.total + ' usuarios');
	});

	$('#toSend').keyup(function(e){
		if(e.keyCode == 13)
		{
  			var sendMessage = $('#toSend').val();
			$('#toSend').val('');
			socket.emit('transmit', { 'room': userRoom, 'userMensaje': sendMessage, 'userNick': userNickname });
		}
	});

	$('#newNick').click(function(e) {
		e.preventDefault();

		socket.emit('changeNick');
	});

	function chatSize()
	{
		var altura = $(window).height() - 150;
		$('#chat').height(altura);
	}

	function autoScroll()
	{
		if ( $('#autoScrollCheck').is(':checked') )
		{
			$('#chat').animate({ scrollTop: $('#anclaBaja').offset().top});
		}
	}
})