var arduino = require('../');

var board = new arduino.Board();

var button = new arduino.Button({
  board: board,
  pin: 2
});

var led = new arduino.Led({
  board: board,
  pin: 13
});

button.on('down', function(){
  led.on();
});

button.on('up', function(){
  led.off();
});
