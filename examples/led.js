var arduino = require('../'),
    board = new arduino.Board();

var led = new arduino.Led({
  board: board,
  pin: 13
});

led.blink();
