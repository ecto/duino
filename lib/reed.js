var events = require('events'),
    util = require('util');

/*
 * Main Reed constructor
 * Process options
 * Tell the board to set it up
 */
var Reed = function (options) {
  if (!options || !options.board) {
    throw new Error('Must supply required options to PIR');
  }
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 7);
  this.state = null;
  this.calibrated = false;

  setInterval(function () {
    this.board.digitalRead(this.pin);
  }.bind(this), 200);

  this.board.on('data', function (message) {
    var m = message.slice(0, -1).split('::'),
        timestamp = new Date(),
        err = null,
        pin, data;

    if (!m.length) {
      return;
    }

    pin = m[0];
    data = m[1];

    if (pin === this.pin) {
      // If this is not a calibration event
      if (this.state != null && this.state != +data) {

        // Update current state of reed instance
        this.state = +data;

        // 'reedclose' event fired when reed is closed
        if (data === '01') {
          this.emit('reedclose', err, timestamp);
        }

        // 'reedopen' event fired when reed is open
        if (data === '00') {
          this.emit('reedopen', err, timestamp);
        }
      }

      // 'calibrated' event fired when reed sensor is
      // ready to detect movement/motion in observable range
      if (!this.calibrated) {
        this.calibrated = true;
        this.state = +data;
        this.emit('calibrated', err, timestamp);
      }
    }
  }.bind(this));
};

util.inherits(Reed, events.EventEmitter);

exports.Reed = Reed;
