var arduino = require('../'),
    board, ldr;

board = new arduino.Board({
  debug: true
});

ldr = new arduino.Sensor({
  board: board,
  pin: 'A0'
});

ldr.on('read', function(err, value) {

  // |value| is reading of the light dependent resistor
  console.log(value);
});
