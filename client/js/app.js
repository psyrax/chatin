var userRoom;
$(document).ready(function(){
	$(document).foundation();
	(function(){

		window.App = {
		    Models: {},
		    Collections: {},
		    Views: {},
		    Router: {}
		};
		App.Router = Backbone.Router.extend({
		    routes: {
		        '': 'index',
		        'c/:id': 'c'
		    },

		    index: function(){
		       userRoom = 'Chatin';
		    },

		    c: function(id){
		        userRoom = id;
		    }
		});

		new App.Router;
		Backbone.history.start();

	})();
	chatSize();
	$(window).resize(function(){
		chatSize();
	})


	var socket = io.connect('http://psyrax-nodechat.jit.su/');
	//var socket = io.connect('http://localhost:1337');
 	var userNickname, userColor;

	socket.on('connect', function() {
   		socket.emit('room', userRoom);
   		$('#chatContent').append('<h5 class="subheader">Bienvenido a ' + userRoom + '</h5>');

	});
	socket.on('message', function(data) {
		messagePrint(data);
		autoScroll();
		$('#info').html(' Hay ' + data.total + ' usuarios');
	});

	socket.on('nickname', function(data){
		userNickname = data.nickname;
		userColor = data.color;
		$('#nickEcho').html('<h6 class="subheader">Eres ' + userNickname + '</h6>');
	})

	socket.on('userMessage', function(data) {
		$('.lastCheck').remove();
		$('#chatContent').append('<p><span class="userDisplay ">T&uacute;:</span> ' + data.mensaje + ' <span class="lastCheck radius secondary label"> - &Uacute;ltimo update <small>' + data.date + '</small> -</span></p>');
		autoScroll();
		$('#info').html(' Hay ' + data.total + ' usuarios');
	});

	socket.on('backlog', function(data){
		$.each(data.backLog, function(index, value){
			messagePrint(value);
		});
		$('#info').html(' Hay ' + data.total + ' usuarios');
	});

	$('#toSend').keyup(function(e){
		if(e.keyCode == 13)
		{
  			var sendMessage = $('#toSend').val();
			$('#toSend').val('');
			socket.emit('transmit', { 'room': userRoom, 
				'userMensaje': sendMessage, 
				'userNick': userNickname,
				'userColor': userColor
			});
		}
	});


	$('#customChatin').on('click', function(){
		window.open('http://oglabs.info/chatin/#c/' + $('#customChatinName').val());
	});

	$('#newNick').on('click', function(e) {
		e.preventDefault();
		socket.emit('changeNick');
	});

	function chatSize()
	{
		var altura = $(window).height()- ( $('#actionLand').height() + 50 );
		$('#chat').height(altura);
		$('#actionLand').width($('#mainContent').width() + 31);
	}
	function autoScroll()
	{
		if ( $('#autoScrollCheck').is(':checked') )
		{
			$('#chat').scrollTop($('#anclaBaja').offset().top);
		}
	}
	function messagePrint(data)
	{
		$('#chatContent').append('<p><span class="otrosDisplay color'+ data.from.color +'">' + data.from.username + ':</span> ' + data.mensaje + '<small> - ' + data.date + '</small></p>');
	}

})