var events = require('events'),
    util = require('util');

/*
 * Main Button constructor
 * Process options
 * Tell the board to set it up
 */
var Button = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Button');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.board.pinMode(this.pin, 'in');
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Button, events.EventEmitter);

module.exports = Button;
