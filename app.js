/*Łukasz Kupiński 2017*/

var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.");

var SOCKET_LIST = {};
var PLAYER_LIST = {};
var MOVES_LIST = {};
var moveCounter = 1;



var Move = function(box, mark, playerId) {

    var self = {
        id: moveCounter++,
        box: box,
        mark: mark,
        playerId: playerId
    };

    return self;

};

var Player = function(id){

    var self = {

        id:id

    };

    Player.list[id] = self;
    return self;
};

Player.list = {};

Player.onConnect = function(socket){
    var player = Player(socket.id);

    socket.on('newMark', function(data){
        var move;

        if (player.id === 1) {
            move = Move(data.box, '<div class="circle"></div>', player.id);
        }
        else if (player.id === 2) {
            move = Move(data.box, '<div class="x"><div class="x"></div></div>', player.id);
        }
        else if (player.id === 3) {
            move = Move(data.box, '<div class="triangle"></div>', player.id);
        }
        else {
            move = Move(data.box, 5, 5);
        }


        MOVES_LIST[move.id]= move;

        for(var j in SOCKET_LIST){
            var socket = SOCKET_LIST[j];
            socket.emit('move', MOVES_LIST);
        }

    });
};

Player.onDisconnect = function(socket){

    delete Player.list[socket.id];

};
var id = 1;

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){


    socket.id = id++;
    SOCKET_LIST[socket.id] = socket;

    Player.onConnect(socket);



    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        Player.onDisconnect(socket);
        delete MOVES_LIST[socket.id];
    });


});







