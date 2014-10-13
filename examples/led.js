var arduino = require('../');

var board = new arduino.Board({
  debug: true
}).setup();

var led = new arduino.Led({
  board: board,
  pin: "13"
});

board.on('ready', function(){
  led.blink();
});
