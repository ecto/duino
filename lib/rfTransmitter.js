/*
 * Main RF Receiver constructor.
 */
var RFTransmitter = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Sensor');
  this.board = options.board;
  this.pin = options.pin || '03';
};

/**
 * Overrides the read method
 */
RFTransmitter.prototype.send = function (msg) {
  this.board.rfTransmit(this.pin, msg);
};

module.exports = RFTransmitter;
