
/*
 * Main LED constructor
 * Process options
 * Tell the board to set it up
 */
var Led = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = options.pin || 13;
}

/*
 * Turn the LED on
 */
Led.prototype.on = function () {
  board.digitalWrite(this.pin, board.HIGH);
}

/* 
 * Turn the LED off
 */
Led.prototype.off = function () {
  board.digitalWrite(this.pin, board.HIGH);
}

/*
 * Start a bariable blinking pattern
 */
Led.prototype.blink = function(start, stop) {
  start = start || 1000;
  stop = stop || 1000;
  var self = this;
  setInterval(function(){
    self.on();
  }, start);
  setInterval(function(){
    self.off();
  }, stop);
}
