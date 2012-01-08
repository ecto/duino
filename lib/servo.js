/*
 * Main Servo constructor
 * Process options
 * Tell the board to set it up
 */
var Servo = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Sutton');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.board.pinMode(this.pin, 'out');
}
