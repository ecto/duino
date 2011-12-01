
var arduino = require('../');

var board = new arduino.Board();

board.on('connected', function(){
  board.write('HELLO WORLD');
});

board.on('message', function(data) {
  console.log(data);
});
