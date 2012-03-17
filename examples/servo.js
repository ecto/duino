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

servo.on('attached', function() {
  console.log('attached');

  this.on('read', function(pos) {
    console.log(pos);
  });

  this.on('detached', function() {
    console.log('detached');
  });

  this.on('aftersweep', function() {
    led.blink();

    this.read();
    this.detach();
  });

  this.sweep();
});
