var events = require('events'),
    util = require('util');

/*
 * Main Ping constructor
 * Process options
 * Tell the board to set it up
 */
var Ping = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Ping');
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 9);

  // Data response is in microseconds
  this.microseconds = 0;
  this.inches = 0;
  this.centimeters = 0;

  var types = {
    read: true
  };

  // Loop and trigger fire-read sequences
  setInterval(function () {
    this.fire();
  }.bind(this), 50);

  this.board.on('data', function (message) {
    var m = message.slice(0, -1).split('::'),
        err = null,
        pin, type, data;

    if (!m.length) {
      return;
    }

    pin = m[0];
    type = m[1];
    data = m.length === 3 ? m[2] : null;

    if (pin === this.pin && types[type]) {
      // See: http://arduino.cc/en/Tutorial/Ping
      // According to Parallax's datasheet for the PING))), there are
      // 73.746 microseconds per inch (i.e. sound travels at 1130 feet per
      // second).  This gives the distance travelled by the ping, outbound
      // and return, so we divide by 2 to get the distance of the obstacle.
      // See: http://www.parallax.com/dl/docs/prod/acc/28015-PING-v1.3.pdf
      this.inches = data / 74 / 2;
      // The speed of sound is 340 m/s or 29 microseconds per centimeter.
      // The ping travels out and back, so to find the distance of the
      // object we take half of the distance travelled.
      this.centimeters = data / 29 / 2;

      this.emit(type, err, data);
    }
  }.bind(this));
};

util.inherits(Ping, events.EventEmitter);

Ping.prototype.command = function () {
  var msg = '97' + this.pin + ([].slice.call(arguments).join(''));

  this.board.write(msg);
};

Ping.prototype.fire = function () {
  this.command('01');
};

module.exports = Ping;
