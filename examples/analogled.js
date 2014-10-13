var arduino = require('../');

var board = new arduino.Board({
  debug: true
}).setup();

var aled = new arduino.Led({
	board: board,
	pin: 9
});

board.on('ready', function(){
  aled.fade();
});
