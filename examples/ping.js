var arduino = require('../'),
    board, ping;

board = new arduino.Board({
  debug: false
});

ping = new arduino.Ping({
  board: board,
  pin: 7
});

// 'read' events fire approx ~50ms
ping.on('read', function(err) {

  // Current sensor data stored in properties
  // of this Ping instance:
  //
  // this.microseconds - time lapse from fire to read
  // this.inches - calculated distance to object in inches
  // this.centimeters - calculated distance to object in centimeters

  console.log('Object is ~' + Math.round(this.inches) + ' inches from sensor');

});

// To test, use the following:
// http://arduino.cc/en/uploads/Tutorial/ping_bb.png
//
// More information:
// http://arduino.cc/en/Tutorial/Ping
