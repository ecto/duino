var arduino = require('../'),
    board, ldr;

board = new arduino.Board({
  debug: true
});

ldr = new arduino.Sensor({
  board: board,
  pin: 'A0'
});

ldr.on('read', function(value) {

  // |value| is reading of the light dependent resistor
  console.log(value);
});

// Tested with:
// SoftPot
//  http://www.spectrasymbol.com/how-it-works-softpot
//  http://www.sparkfun.com/datasheets/Sensors/Flex/SoftPot-Datasheet.pdf
//
// LDR
//  http://www.ladyada.net/learn/sensors/cds.html
