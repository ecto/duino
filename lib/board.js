
var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    serial = require('serialport').SerialPort;

/*
 * The main Arduino constructor
 * Connect to the serial port and bind
 */
var Board = function (options) {
  this.messageBuffer = '';
  var self = this;
  this.detect(function (err, serial) {
    if (err) throw err;
    self.serial = serial;
    self.serial.on('data', function(data){
      self.emit('data', data);
      self.messageBuffer += data;
      self.attemptParse();
    });
    self.emit('connected');
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
  child.exec('ls /dev | grep usb', function(err, stdout, stderr){
    var possible = stdout.slice(0, -1).split('\n'),
        found = false;
    for (var i in possible) {
      var tempSerial, err;
      try {
        tempSerial = new serial('/dev/' + possible[i]);
      } catch (e) {
        err = e;
      }
      if (!err) {
        found = tempSerial;
        break;
      }
    }
    if (found) cb(null, found);
    else cb(new Error('Could not find Arduino'));
  });
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
  this.serial.write(m);
}

/*
 * Set a pin's mode
 * val == out = 01
 * val == in  = 00
 */
Board.prototype.pinMode = function (pin, val) {
  this.serial.write(
    '00' +
    pin +
    (val == 'out' ? '01' : '00')
  );
}

/*
 * Tell the board to write to a digital pin
 */
Board.prototype.digitalWrite = function (pin, val) {
  this.serial.write('01' + pin + val + '\r');
}

Board.prototype.digitalRead = function (pin, val) {}
Board.prototype.analogWrite = function (pin, val) {}
Board.prototype.analogWrite = function (pin, val) {}

module.exports = Board;
