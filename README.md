# duino

A framework for working with Arduinos in node.js

![arduino](http://i.imgur.com/eFq84.jpg)

# install

    npm install duino

# usage

````javascript
var arduino = require('duino'),
    board = new arduino.Board();

board.on('connected', function(){
  board.write('Hello world!');
});

var led = new arduino.Led({
  board: board,
  pin: 13
});

led.blink();
````

# libraries

##board

###board.serial

Low-level access to the serial connection to the board

###board.write(msg)

Write a message to the board using predefined delimiters

###board.pinMode(pin, mode)

Set the mode for a pin. `mode` is either `'in'` or `'out'`

###board.digitalWrite(pin, val)

Write one of the following to a pin:

####board.HIGH and board.LOW

Constants for use in low-level digital writes

##led

###led.on()

Turn the LED on

###led.off()

Turn the LED off

###led.blink(interval)

Blink the LED at `interval` ms. Defaults to 1000

##button

##servo

##motor

##piezo

##potentiometer

# license

(The MIT License)

Copyright (c) 2011 Cam Pedersen <cam@onswipe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

