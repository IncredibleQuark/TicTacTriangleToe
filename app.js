// var express = require('express'),
//     app = express();
//     serv = require('http').Server(app);
//
//
//
//     app.get('/', function(req, res) {
//
//         res.sendFile(__dirname + '/client/index.html');
//
//     });
//
//     app.use('/client', express.static(__dirname + '/client'));
//
//     serv.listen(2000);
//     console.log('Server start');
//
//
//     var SOCKET_LIST = {};
//     var PLAYER_LIST = {};
//
//     var Player = function (id) {
//         var moves = [];
//
//         var self = {
//             id: id,
//             moves: moves
//         };
//
//
//         self.updateMoves = function (move) {
//             moves.push(move)
//         };
//         return self;
//     };
//
//     var io = require('socket.io') (serv, {});
//
//     io.sockets.on('connection', function (socket) {
//
//         socket.id = Math.random();
//         socket.number = Math.floor(10 * Math.random());
//         SOCKET_LIST[socket.id] = socket;
//
//
//         player = Player(socket.id);
//         // if (Object.keys(PLAYER_LIST).length === 0) {
//         //
//         //      mark = '<div class="x"><div class="x"></div></div>';
//         //      player = Player(socket.id, mark);
//         // }
//         // else if (Object.keys(PLAYER_LIST).length === 1) {
//         //
//         //     mark = '<div class="circle"></div>';
//         //     player = Player(socket.id, mark);
//         // }
//
//         PLAYER_LIST[socket.id] = player;
//
//         socket.on('newMark', function (data) {
//
//
//             player.updateMoves(data.position);
//
//         });
//         // socket.on('newMark', function (data) {
//         //
//         //     for(var i in SOCKET_LIST) {
//         //         var socket = SOCKET_LIST[i];
//         //
//         //         socket.emit('move', {
//         //             box: data.position,
//         //             number: socket.number,
//         //             mark: PLAYER_LIST[socket].mark
//         //         });
//         //     }
//         //
//         // });
//
//         setInterval(function () {
//
//             var pack = [];
//
//             for (var i in PLAYER_LIST) {
//                 var player = PLAYER_LIST[i];
//
//                 pack.push({
//                     mark: player.mark,
//                     position: player.position,
//                     moves: player.moves
//                 });
//             }
//
//             for (var j in SOCKET_LIST) {
//                 var socket = SOCKET_LIST[j];
//                 socket.emit('move', pack);
//             }
//
//         }, 1000/25);
//
//
//         socket.on('disconnect', function () {
//             delete SOCKET_LIST[socket.id];
//             delete PLAYER_LIST[socket.id];
//         })
//     });

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

var Move = function(id, box, playerId) {
    var self = {
        id: id,
        box: box,
        playerId: playerId
    };
    return self;
};

var Player = function(id){
    var self = {

        id:id

    };

    return self;
};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    var player = Player(socket.id);
    PLAYER_LIST[socket.id] = player;




    socket.on('disconnect',function(){
        delete SOCKET_LIST[socket.id];
        delete PLAYER_LIST[socket.id];
        delete MOVES_LIST[player.id];
    });


    socket.on('newMark', function(data){
        // var pack = [];
        // player.move = data.box;
        // for(var i in PLAYER_LIST){
        //     player = PLAYER_LIST[i];
        //     pack.push({
        //         x:player.x,
        //         y:player.y,
        //         move: player.move,
        //         number:player.number
        //     });
        // }


        var moveId = Math.round(100 * Math.random());
        var move = Move(moveId, data.box, player.id);
        MOVES_LIST[move.id]= move;

        for(var j in SOCKET_LIST){
            var socket = SOCKET_LIST[j];
            socket.emit('move', MOVES_LIST);
        }




    });


});







