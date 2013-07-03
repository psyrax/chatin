$(document).ready(function(){
	$(document).foundation();
	window.App = {
	    Models: {},
	    Collections: {},
	    Views: {},
	    Router: {}
	};
	

	var UserModel = Backbone.Model.extend({
		defaults: {
			'username' : 'username',
			'color' : '0'
		},
		initialize:function () {
	       this.on('change', function(){
		        $('#nickEcho').html('<h6 class="subheader">Eres ' + this.get('username') + '</h6>');
		    });
	    }
	});


	var ChatRoom = Backbone.Model.extend({
		defaults: {
			'chatRoom': 'Chatin',
			'totalUsers': '0',
			'messageHistory': ''
		},
		initialize: function(){
			this.on('change:totalUsers', function(){
				$('#info').html(' Hay ' + this.get('totalUsers') + ' usuarios');
			});
			this.on('change:chatRoom', function(){
				$('#chatContent').html('<h5 class="subheader">Bienvenido a ' + this.get('chatRoom') + '</h5>');
				$('#chatName').html(this.get('chatRoom'));
			});
		}
	});

	var room = new ChatRoom();

	var user = new UserModel();



	App.Router = Backbone.Router.extend({
	    routes: {
	        '': 'index',
	        'c/:id': 'c'
	    },

	    index: function(){
	       
	    },

	    c: function(id){
	        room.set({
	        	'chatRoom': id
	        })
	    }
	});

	new App.Router;
	Backbone.history.start();




	chatSize();
	$(window).resize(function(){
		chatSize();
	})


	var socket = io.connect('http://psyrax-nodechat.jit.su/');
	//var socket = io.connect('http://localhost:1337');


	socket.on('connect', function() {
   		socket.emit('room', room.get('chatRoom'));
	});
	socket.on('message', function(data) {
		messagePrint(data);
		autoScroll();
		room.set({
			'totalUsers': data.total
		})
	});

	socket.on('nickname', function(data){
		user.set({
			'username' : data.nickname,
			'color' : data.color
		});
	})

	socket.on('userMessage', function(data) {
		$('.lastCheck').remove();
		$('#chatContent').append('<p><span class="userDisplay ">T&uacute;:</span> ' + data.mensaje + ' <span class="lastCheck radius secondary label"> - &Uacute;ltimo update <small>' + data.date + '</small> -</span></p>');
		room.set({
			'totalUsers': data.total
		});
		autoScroll();
	});

	socket.on('backlog', function(data){
		$.each(data.backLog, function(index, value){
			messagePrint(value);
		});
		room.set({
			'totalUsers': data.total
		});
	});

	$('#toSend').keyup(function(e){
		if(e.keyCode == 13)
		{
  			var sendMessage = $('#toSend').val();
			$('#toSend').val('');
			socket.emit('transmit', { 'room': room.get('chatRoom'), 
				'userMensaje': sendMessage, 
				'userNick': user.get('username'),
				'userColor': user.get('color')
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