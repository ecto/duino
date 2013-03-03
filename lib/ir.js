/*
 * Main IR constructor
 * Process options
 * Tell the board to set it up
 */
var IR = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to IR');
  this.board = options.board;
}

/*
 * Send IR code
 * types:
 * 1 RC5
 * 2 RC6
 * 3 NEC
 * 4 Sony
 * 5 DISH
 * 6 Sharp
 * 7 Panasonic
 * 8 JVC
 */
IR.prototype.send = function (type, val, len) {
  len = len + '';
  for (var i = len.length; i < 4; i++) {
  	len = '0' + len;
  };
  var msg = '9500' + type + val + len;
  this.board.write(msg);
}

module.exports = IR;
