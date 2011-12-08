var arduino = require('../');

var board = new arduino.Board();

var button = new arduino.Button({
  board: board,
  pin: 2
});

button.on('down', function(){
  console.log('DOWN');
});

button.on('up', function(){
  console.log('UP');
});
