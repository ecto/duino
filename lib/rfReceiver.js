var events = require('events'),
    util = require('util'),
    Sensor = require('./sensor');

/*
 * Main RF Receiver constructor.
 */
var RFReceiver = function (options) {
  Sensor.call(this, options);
};

/*
 * Extends from Sensor.
 */
util.inherits(RFReceiver, Sensor);

/**
 * Overrides the read method
 */
RFReceiver.prototype.read = function () {
  setInterval(function () {
    this.board.rfRead(this.pin);
  }.bind(this), this.throttle);
};

module.exports = RFReceiver;
