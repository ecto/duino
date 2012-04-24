var events = require('events'),
    util = require('util');

/*
 * Main PIR constructor
 * Process options
 * Tell the board to set it up
 */
var PIR = function (options) {
  if (!options || !options.board) {
    throw new Error('Must supply required options to PIR');
  }
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 9);
  this.state = null;
  this.calibrated = false;

  setInterval(function () {
    this.board.digitalRead(this.pin);
  }.bind(this), 50);

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

        // Update current state of PIR instance
        this.state = +data;

        // 'motionstart' event fired when motion occurs
        // within the observable range of the PIR sensor
        if (data === '01') {
          this.emit('motionstart', err, timestamp);
        }

        // 'motionend' event fired when motion has ceased
        // within the observable range of the PIR sensor
        if (data === '00') {
          this.emit('motionend', err, timestamp);
        }
      }

      // 'calibrated' event fired when PIR sensor is
      // ready to detect movement/motion in observable range
      if (!this.calibrated) {
        this.calibrated = true;
        this.state = +data;
        this.emit('calibrated', err, timestamp);
      }
    }
  }.bind(this));
};

util.inherits(PIR, events.EventEmitter);

module.exports = PIR;
