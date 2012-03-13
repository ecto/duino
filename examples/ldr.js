var arduino = require('../');

var board = new arduino.Board({
  // debug: true
});

var ldr = new arduino.LDR({
  board: board,
  pin: 'A0'
});

ldr.on('data', function( value ) {

  // |value| is reading of the light dependent resistor
  console.log( value );
});
