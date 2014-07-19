/*
 * Main RC constructor
 * Process options
 * Tell the board to set it up
 */
var RC = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 10);
}

/*
 * Send triState code
 */
RC.prototype.triState = function (val) {
  var msg = '96' + this.pin + val;
  this.board.write(msg);	
}

/*
 * Send decimal code
 * val must be 12 chars or less
 */
RC.prototype.decimal = function (val) {
  // at most twelve, null-term if shorter
  var terminatedval = (val + '\0').slice(0,12)
  var msg = '94' + this.pin + terminatedval;
  this.board.write(msg);
}

module.exports = RC;
