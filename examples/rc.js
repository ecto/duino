var arduino = require('../')
    board, rc;

var board = new arduino.Board({
  debug: true
}).setup();

var rc = new arduino.RC({
  board: board,
  pin: "10"
});

board.on('ready', function(){
  setTimeout(function() {
    // alternative: rc.decimal("123456")
  	rc.triState("0FFF0FFFFF0F");
  }, 1000);
  setTimeout(function() {
  	rc.triState("0FFF0FFFFF00");
  }, 2000);
});
