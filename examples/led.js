var arduino = require('../');

var board = new arduino.Board({
  debug: true
});

var led = new arduino.Led({
  board: board,
  pin: 9
});

/*var aled = new arduino.Led({
	board: board,
	pin: 9
});*/

board.on('ready', function(){
  led.blink();
  //aled.fade();
});
