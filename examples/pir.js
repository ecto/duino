var arduino = require('../'),
    board, pir;

board = new arduino.Board({
  debug: false
});

pir = new arduino.PIR({
  board: board,
  pin: 7
});

// 'calibrated' event fired when PIR sensor is
// ready to detect movement/motion in observable range
//
// All events receive error and date arguments
pir.on('calibrated', function(err, date) {

  console.log('calibrated');

  // Current sensor data stored in properties
  // of this PIR instance:
  //
  // this.state - current state of motion
  //     0 No motion currently detected
  //     1 Motion currently detected

  // 'motionstart' event fired when motion occurs
  // within the observable range of the PIR sensor
  this.on('motionstart', function(err, date) {

    console.log('motionstart', this.state);
    console.log( date );

  });

  // 'motionend' event fired when motion has ceased
  // within the observable range of the PIR sensor
  this.on('motionend', function(err, date) {

    console.log('motionend', this.state);

  });
});


// To test, use the following:
// http://www.ladyada.net/images/sensors/pirardbb.gif
// http://bildr.org/blog/wp-content/uploads/2011/06/PIR-Arduino_hookup.png
//
// More information:
// http://www.ladyada.net/learn/sensors/pir.html
