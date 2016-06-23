     
var socket = io('/');
$(document).ready(function(){
        squares = {};
    var joined = false;
    var mainSquare;
    $('#message').hide();
    $('#username-field').focus();
    $('#roomBox').hide();
    $('#messages').hide();
    $("#game").hide();
        $("#username").submit(function(){
            if($('#username-field').val() != ""){
                socket.emit("join", $('#username-field').val());
                joined = true;
                $("#username").hide();
                $('#message').show();
                $('#roomBox').show();
                $('#game').show();
            }
            return false;
        })
        socket.on("update", function(msg){
            console.log(JSON.stringify(msg));
            if(joined){
                toastr.success(msg.message);   
                $('#name').text(msg.username);
             mainSquare = Crafty.e('2D, DOM, Color, Text, Fourway, Collision')
  .attr({x: 40, y: 40, w: 50, h: 50})
  .color('#CCCFFF')
  .fourway(800)
  .text(msg.username)
  .textFont({
        size: '50px',
        weight: 'bold',
    }).collision()
    .onHit("Wall", function(){
        mainSquare.attr({x:-100, y: -100, fourway: 0});
socket.emit("death", {username: this._text, message: this._text + " has died!"});    
        Crafty.scene("loading", function(){
            Crafty.background("#000");
            Crafty.e("2D, DOM, Text")
          .attr({ w: 200, h: 20, x: 400, y: 150 })
          .text("You died!")
          .css({ "text-align": "center"})
          .textFont({
                size: '30px',
                weight: 'bold'
            })
          .textColor("#FFFFFF");
            Crafty.e("2D, DOM, Text, Mouse")
          .attr({ w: 100, h: 30, x: 450, y: 200 })
         .css({"border-radius": "20px", "background-color": "#CCCFFF", "padding": "5px"})
          .text("Restart?")
              .textFont({
                size: '20px',
                weight: 'bold'
            })
          .css({ "text-align": "center",  "font-size": "50px"})
          .textColor("black")
        .bind("MouseOver", function(){
                this.css({"cursor":"pointer", "background-color": "blue"});
            }) 
        .bind("MouseOut", function(){
                this.css({"background-color": "#CCCFFF"});
            })
        .bind("Click", function(){
                Crafty.enterScene("main");
                $.each(squares, function(username, square){
                    squares[username] = null;
                })
                socket.emit("join", mainSquare._text);
            });
        })   
           Crafty.enterScene("loading");

             })
//    .onHit("otherPlayer", function(){
//                 mainSquare.destroy();
//                 alert("you died");
//             })
  .bind("Move", function(oldPosition){
      console.log(oldPosition._x, this.x);
        socket.emit("square", {username: msg.username, pos: oldPosition});
  });
            }
        })
        socket.on("update-new", function(msg){
            if(joined){
                toastr.success(msg.message);

            }
        })
        socket.on("update-square", function(data){
            if(joined){
            $.each(data, function(id, username){
                   if((username != mainSquare._text) && (squares[username]==null)){
                          squares[username] = Crafty.e('2D, DOM, Color, Text, otherPlayer')
                          .attr({x: 40, y: 40, w: 50, h: 50})
                          .color('#CCCFFF')
                          .text(username)
                          .textFont({
                                size: '50px',
                                weight: 'bold',
                            })                   
                    }
            })
            
            }
        })
        socket.on("square-disconnect", function(data){
            squares[data.username].destroy();
        })
        socket.on("update-room", function(room){
            if(joined){
                $('#room-list').empty();
                $.each(room, function(clientid, username){
                    $('#room-list').append($("<li>").text(username));
                })
            }
        })
        $('#message').submit(function(){
                if(joined){
                socket.emit('chat message', $('#message-field').val());
                }
                $('#message-field').val('');
                return false;
        });
        socket.on('chat message', function(msg){
            if(joined){
         $('#messages').show();
        $('#messages').append($('<li>').text(msg));
                 document.getElementById('messages').scrollTop =  document.getElementById('messages').scrollHeight;
            }
        });
        socket.on("disconnected",function(){
            toastr.warning("Your internet is disconnected");
            $("#message-field").attr("disabled", "disabled");
        })
        
  Crafty.init(1000,500, document.getElementById('game'));
Crafty.scene("main", function(){
        Crafty.background("white");
    Crafty.e('Floor, 2D, Canvas, Color, Wall')
  .attr({x: 0, y: 490, w: 1000, h: 10})
  .color('red');
        Crafty.e('Floor, 2D, Canvas, Color, Wall')
  .attr({x: 0, y: 0, w: 1000, h: 10})
  .color('red');
        Crafty.e('Floor, 2D, Canvas, Color, Wall')
  .attr({x: 0, y: 0, w: 10, h: 500})
  .color('red');
        Crafty.e('Floor, 2D, Canvas, Color, Wall')
  .attr({x: 990, y: 0, w: 10, h: 500})
  .color('red');
})
    Crafty.enterScene("main");

    function strip(obj) {
        return JSON.parse(JSON.stringify(obj).split("_").join(""));
    }
    socket.on("other-square", function(pos){
        squares[pos.username].attr(strip(pos.pos));
})
    socket.on("died", function(data){
        toastr.error(data.message, "RIP");
    })
})
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
      