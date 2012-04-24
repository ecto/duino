var arduino = require('../');

var board = new arduino.Board({
  debug: true
});

var piezo = new arduino.Piezo({
  board: board
});

board.on('ready', function(){
  piezo.note('a', 1000);

  setTimeout(function(){
    piezo.note('b', 1100);
  }, 1000);
});


// Resources
//  http://arduino.cc/en/Tutorial/Tone4
