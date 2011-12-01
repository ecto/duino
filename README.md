# duino

A framework for working with Arduinos in node.js

# install

    npm install duino

# usage

````javascript
var arduino = require('duino'),
    board = new arduino.Board();

board.on('connected', function(){
  board.write('Hello world!');
});
````
