# duino

A framework for working with Arduinos in node.js

![arduino](http://i.imgur.com/eFq84.jpg)

# install

    npm install duino

# usage

````javascript
var arduino = require('duino'),
    board = new arduino.Board();

var led = new arduino.Led({
  board: board,
  pin: 13
});

led.blink();
````

# what ಠ_ಠ

The way this works is simple (in theory, not in practice). The Arduino listens for low-level signals over a serial port, while we abstract all of the logic on the Node side.

1.  Plug in your Arduino
2.  Upload the C code at `./src/du.ino` to it
3.  Write a simple **duino** script
4.  ?????
5.  Profit!

# libraries

##board

Right now, the board library will attempt to autodiscover the Arduino. I'm going to make it configurable, don't worry.

````javascript
var board = new arduino.Board({
  debug: true
});
````

Debug mode is off by default. Turning it on will enable verbose logging in your terminal, and tell the Arduino board to echo everthing back to you. You will get something like this:

![debug](http://i.imgur.com/W7LUW.png)

The **board** object is an EventEmitter. You can listen for the following events:

* `data` raw output from the serial port
* `message` on newline, emits all data since the last newline
* `connected` when the serial port has connected
* `ready` when all internal post-connection logic has finished and the board is ready to use

````javascript
board.on('connected', function(){
  console.log('Connected!');
});

board.on('message', function(m){
  console.log(m);
}
````

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

````javascript
var led = new arduino.Led({
  board: board,
  pin: 13
});
````

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

# protocol

Each message sent to the Arduino board by the **board** class has 8 bytes.

A full message looks like this:

    !011301.

`!` Start
`01` Command (digitalWrite)
`13` Pin number
`01` Value (high)
`.` Stop

I was drunk. It works.

##command

What is implemented right now:

*  `00` pinMode
*  `01` digitalWrite

##pin

I haven't tested analog pins yet. Soon. Digital pins 0-13 tested.

##value

*  `00` low
*  `01` high

# license

(The MIT License)

Copyright (c) 2011 Cam Pedersen <cam@onswipe.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

