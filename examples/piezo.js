var arduino = require('../');

var board = new arduino.Board({
  debug: true
});

var piezo = new arduino.Piezo({
  board: board
});

board.on('ready', function(){
  piezo.note('c', 1000);
});
