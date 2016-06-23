var express = require('express');
var socketio = require('socket.io');
var http = require('http');
var PORT = process.env.PORT || 80;
var app = express();
var server = http.Server(app);
var io = socketio(server);
var room = {};
app.use(express.static('public-game'));
    io.on('connection', function(socket){
        socket.on("join", function(username){
        console.log(username + " joined");
        room[socket.id] = username;
        socket.emit("update", {message: "You have connected to the room", username: username});
        socket.broadcast.emit("update-new", {message: username + " has joined the room", username: username}); 
        io.emit("update-square", room);
        io.emit("update-room", room);
        })

        socket.on('chat message', function(msg){
        console.log(room[socket.id] + msg);
            if(msg!=""){
                io.emit('chat message', room[socket.id] + ": " + msg);
            }
        });
        socket.on("disconnect", function(){
            if(room[socket.id]!=null){
            io.emit("update-new", {message:room[socket.id] + " has left"});
            io.emit("square-disconnect", {username: room[socket.id]});
            delete room[socket.id];
            io.emit("update-room", room);
            socket.emit("disconnected");
            }
        })
        socket.on("square", function(data){
            socket.broadcast.emit("other-square", data);
        })
        socket.on("death", function(data){
            socket.broadcast.emit("died", data);
        })
    });

server.listen(PORT, function() {
    console.log('Server listening on port ' + PORT + '!');
});