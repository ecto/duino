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
  this.down = false;
  this.board.pinMode(this.pin, 'in');
  var self = this;
  setInterval(function () {
    self.board.digitalRead(self.pin);
  }, 50);
  this.board.on('data', function (m) {
    m = m.slice(0, -1).split('::');
    if (m.length > 1 && m[0] == self.pin) {
      // 1 is up
      // 0 is down
      if (m[1] == '1' && self.down) {
        self.down = false;
        self.emit('up');
      }
      if (m[1] == '0' && !self.down) {
        self.down = true;
        self.emit('down');
      }
    }
  });
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Button, events.EventEmitter);

module.exports = Button;
