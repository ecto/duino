# [rf]duino

This fork of [ecto's duino library](https://github.com/ecto/duino) replaces the servo library with a RF receiver.

# usage

````javascript
var arduino = require('duino'),
    board = new arduino.Board();

board.on('ready', function(){

  var rfReceiver = new arduino.RFReceiver({
    board: board,
    pin: '02'
  });

  rfReceiver.on('read', function(err, data){
    console.log("data", data);
  });
});
````

