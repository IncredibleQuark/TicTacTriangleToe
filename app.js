var express = require('express'),
    app = express();
    serv = require('http').Server(app);



    app.get('/', function(req, res) {

        res.sendFile(__dirname + '/client/index.html');

    });

    app.use('/client', express.static(__dirname + '/client'));

    serv.listen(2000);
    console.log('Server start');


    var io = require('socket.io') (serv, {});

    io.sockets.on('connection', function (socket) {

        socket.id = Math.random();

        socket.on('disconnect', function() {
            delete SOCKET_LIST[socket_id]
        })

    });




