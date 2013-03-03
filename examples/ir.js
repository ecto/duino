var arduino = require('../')
var arduino = require('../')
    board, ir;

var board = new arduino.Board({
  debug: true
});

var ir = new arduino.IR({
  board: board
});

board.on('ready', function(){
  setTimeout(function() {
    //ir.send(3, "20DF10EF", 48);
    ir.send(7, "802080A0", "C2CA");
  }, 1000);
});
