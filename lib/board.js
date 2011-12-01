
var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    serial = require('serialport').SerialPort;

var Board = function (options) {
  var self = this;
  this.detect(function (err, serial) {
    self.serial = serial;
    self.serial.on('data', self.read);
    self.emit('connected');
  });
}

util.inherits(Board, events.EventEmitter);

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

Board.prototype.read = function (m) {
  console.log(m);
}

Board.prototype.write = function (m) {
  this.serial.write(m + '\r');
}

module.exports = Board;
