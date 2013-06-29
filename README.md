# [rf]duino

This fork of [ecto's duino library](https://github.com/ecto/duino) replaces the servo library with a RF receiver and transmitter.

# receiver usage

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

# transmitter usage

````javascript
var arduino = require('duino'),
    board = new arduino.Board();

board.on('ready', function(){

  var rfTransmitter = new arduino.RFTransmitter({
    board: board,
    pin: '03'
  });

  rfTransmitter.send("hey there delilah");
});
````

Note that the transmitter can only send up to 26 characters at a time.
Messages may be dropped if messages are sent at high rates.