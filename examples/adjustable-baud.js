var arduino = require('../');

var board = new arduino.Board({
  debug: true,
  baudrate: 9600
});

var led = new arduino.Led({
  board: board,
  pin: 9
});

board.on('ready', function(){
  led.blink();
});
