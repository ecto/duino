var arduino = require('../'),
    board = new arduino.Board();

var on = true;

board.on('connected', function(){
  setTimeout(function(){
    board.pinMode(13, 'out');
  }, 800);
  setInterval(function(){
    if (on) {
      board.digitalWrite(13, '01');
      on = false;
    } else {
      board.digitalWrite(13, '00');
      on = true;
    }
  }, 1000);
});

board.on('message', function(data) {
  console.log('  ' + data);
});
