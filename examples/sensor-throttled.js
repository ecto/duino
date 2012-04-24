var arduino = require('../'),
    board, sensor, piezo;

board = new arduino.Board({
  debug: false
});

sensor = new arduino.Sensor({
  board: board,
  pin: 'A0',
  throttle: 100
});

piezo = new arduino.Piezo({
  board: board,
  pin: 11
});

sensor.on('read', function(err, value) {
  value = +value;

  // |value| is the raw sensor output
  console.log( value );

  if ( value > 0 ) {
    piezo.note('b', 100);
  }
});

// Tested with:
// SoftPot
//  http://www.spectrasymbol.com/how-it-works-softpot
//  http://www.sparkfun.com/datasheets/Sensors/Flex/SoftPot-Datasheet.pdf
//
// sensor
//  http://www.ladyada.net/learn/sensors/cds.html
