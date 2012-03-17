var arduino = require('../');

var board = new arduino.Board({
  debug: true
});

var servo = new arduino.Servo({
  board: board
});

servo.sweep();
