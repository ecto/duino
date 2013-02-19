
/*
 * Main RC constructor
 * Process options
 * Tell the board to set it up
 */
var RC = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = options.pin || 10;
}

/*
 * Send triState code
 */
RC.prototype.triState = function (val) {
  var msg = '96' + this.pin + val;
  this.board.write(msg);	
}

module.exports = RC;
