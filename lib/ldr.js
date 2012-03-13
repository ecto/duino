var events = require('events'),
    util = require('util');

/*
 * Main LDR constructor
 * Process options
 * Tell the board to set it up
 */
var LDR = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LDR');
  this.board = options.board;
  this.pin = options.pin || 'A0';
  this.board.pinMode(this.pin, 'in');

  var self = this;
  setInterval(function () {
    self.board.analogRead(self.pin);
  }, 50);

  this.board.on('data', function (m) {
    m = m.slice(0, -1).split('::');
    self.emit('data', m[1]);
  });
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(LDR, events.EventEmitter);

module.exports = LDR;
