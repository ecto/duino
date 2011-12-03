
/*
 * Main Pieze constructor
 * Process options
 * Tell the board to set pin mode
 */
var Piezo = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Piezo');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.board.pinMode(this.pin, 'out');
}

/*
 * Turn the Piezo on
 */
Piezo.prototype.on = function () {
  this.board.digitalWrite(this.pin, this.board.HIGH);
}

/*
 * Turn the LED off
 */
Piezo.prototype.off = function () {
  this.board.digitalWrite(this.pin, this.board.LOW);
}

module.exports = Piezo;
