
var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    colors = require('colors'),
    serial = require('serialport').SerialPort;

/*
 * The main Arduino constructor
 * Connect to the serial port and bind
 */
var Board = function (options) {
  this.log('info', 'initializing');
  this.debug = options && options.debug || false;
  this.messageBuffer = '';
  this.writeBuffer = [];

  var self = this;
  this.detect(function (err, serial) {
    if (err) throw err;
    self.serial = serial;
    self.emit('connected');

    self.log('info', 'binding serial events');
    self.serial.on('data', function(data){
      self.log('receive', data.toString().red);
      self.emit('data', data);
      self.messageBuffer += data;
      self.attemptParse();
    });

    setTimeout(function(){
      self.log('info', 'board ready');

      if (self.debug) {
        self.log('info', 'sending debug mode toggle on to board');
        self.serial.write('!990001.');
        process.on('SIGINT', function(){
          self.log('info', 'sending debug mode toggle off to board');
          self.serial.write('!990000.');
          delete self.serial;
          setTimeout(function(){
            process.exit();
          }, 200);
        });
      }

      if (self.writeBuffer.length > 0) {
        self.processWriteBuffer();
      }

      self.emit('ready');
    }, 700);
  });
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Board, events.EventEmitter);

/*
 * Detect an Arduino board
 * Loop through all USB devices and try to connect
 * This should really message the device and wait for a correct response
 */
Board.prototype.detect = function (cb) {
  this.log('info', 'attempting to find Arduino board');
  var self = this;
  child.exec('ls /dev | grep usb', function(err, stdout, stderr){
    var possible = stdout.slice(0, -1).split('\n'),
        found = false;
    for (var i in possible) {
      var tempSerial, err;
      try {
        tempSerial = new serial('/dev/' + possible[i], {
          baudrate: 115200
        });
      } catch (e) {
        err = e;
      }
      if (!err) {
        found = tempSerial;
        self.log('info', 'found board at ' + tempSerial.port);
        break;
      }
    }
    if (found) cb(null, found);
    else cb(new Error('Could not find Arduino'));
  });
}

/*
 * Process the writeBuffer (messages attempted before serial was ready)
 */
Board.prototype.processWriteBuffer = function () {
  this.log('info', 'processing buffered messages');
  while (this.writeBuffer.length > 0) {
    this.log('info', 'writing buffered message');
    this.write(this.writeBuffer.shift());
  }
}

/*
 * Attempt to parse the message buffer via delimiter
 * Called every time data bytes are received
 */
Board.prototype.attemptParse = function (data) {
  var b = this.messageBuffer.split('\r\n');
  while (b.length > 1) {
    this.emit('message', b.shift());
  }
  this.messageBuffer = b[0];
}

/*
 * Low-level serial write
 */
Board.prototype.write = function (m) {
  if (this.serial) {
    this.log('write', m);
    this.serial.write('!' + m + '.');
  } else {
    this.log('info', 'serial not ready, buffering message: ' + m.red);
    this.writeBuffer.push(m);
  }
}

Board.prototype.HIGH = '01';
Board.prototype.LOW = '00';

/*
 * Set a pin's mode
 * val == out = 01
 * val == in  = 00
 */
Board.prototype.pinMode = function (pin, val) {
  this.log('info', 'set pin ' + pin + ' mode to ' + val);
  val = (
    val == 'out' ?
    '01' :
    '00'
  );
  this.write('00' + pin + val);
}

/*
 * Tell the board to write to a digital pin
 */
Board.prototype.digitalWrite = function (pin, val) {
  this.log('info', 'digitalWrite to pin ' + pin + ': ' + val.green);
  this.write('01' + pin + val);
}

Board.prototype.digitalRead = function (pin, val) {}
Board.prototype.analogWrite = function (pin, val) {}
Board.prototype.analogWrite = function (pin, val) {}

/*
 * Utility function to pause for a given time
 */
Board.prototype.delay = function (ms) {
  ms += +new Date();
  while (+new Date() < ms) { }
} 

/*
 * Logger utility function
 */
Board.prototype.log = function (level, message) {
  if (this.debug) {
    console.log(String(+new Date()).grey + ' duino '.blue + level.magenta + ' ' + message);
  }
}

module.exports = Board;
