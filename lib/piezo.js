
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
 * Send a square wave to the speaker
 *
 * timeHigh = period / 2 = 1 / (2 * toneFrequency)
 *
 * note   frequency   period   timeHigh
 *  c       261hz      3830      1915
 *  d       294hz      3400      1700
 *  e       329hz      3038      1519
 *  f       349hz      2854      1432
 *  g       392hz      2550      1275
 *  a       440hz      2272      1136
 *  b       493hz      2028      1014
 *  c       523hz      1912       956
 */
Piezo.prototype.tone = function (note, length) {
  var start = +new Date();
  var end = start + length;
  for (i = start; i < end; i++) {
    this.board.digitalWrite(this.pin, this.board.HIGH);
    this.board.digitalWrite(this.pin, this.board.LOW);
  }
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
