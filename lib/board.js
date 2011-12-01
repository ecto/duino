var SerialPort = require('serialport').SerialPort;

var Board = function (options) {
  this.serial = new SerialPort("/dev/tty.usbmodem3a21");
  this.serial.on('data', this.read);
}

Board.prototype.read = function (m) {
  console.log(m);
}

Board.prototype.write = function (m) {
  this.serial.write(m + '\r');
}

module.exports = Board;
