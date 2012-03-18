var arduino = require('../'),
    board, led, servo;

// Construct instances
board = new arduino.Board({
  debug: true
});

led = new arduino.Led({
  board: board,
  pin: 13
});

servo = new arduino.Servo({
  board: board,
  pin: 9
});

// Once servo is attached:
//  - "read"
//      - log position
//  - "aftersweep"
//      - blink the led
//      - read the position
//      - detach the servo
//  - "detached"
//      - log detach message
//
//  - execute full sweep

servo.on('attached', function(err) {
  console.log('attached');

  this.on('read', function(err, pos) {
    console.log(pos);
  });

  this.on('detached', function(err) {
    console.log('detached');
  });

  this.on('aftersweep', function(err) {
    led.blink();

    this.read();
    this.detach();
  });

  this.sweep();
});

// To test, use the following:
// http://arduino.cc/en/uploads/Tutorial/sweep_BB.png
//
// More information:
// http://www.ladyada.net/learn/sensors/pir.html
