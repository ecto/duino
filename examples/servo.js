var arduino = require('../');

var board = new arduino.Board({
  debug: true
});

var servo = new arduino.Servo({
  board: board,
  pin: "A0"
});



servo.on("attached", function() {

  this.read(function(current) {
    this.write(180);
  });



});
