var arduino = require('../');

var board = new arduino.Board({
  debug: false
});

var reed = new arduino.Reed({
  board : board,
  pin   : 7,
  emitInitState: true
});

reed.on('calibrated', function(err, date) {
  console.log('calibrated');

  this.on('reedopen', function(err, date) {
    console.log('reedopen', this.state);
  });

  this.on('reedclose', function(err, date) {
    console.log('reedclose');
  });
});
