
/*
 * Main LED constructor
 * Process options
 * Tell the board to set it up
 */
var Led = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.bright = false;
  this.board.pinMode(this.pin, 'out');
}

/*
 * Turn the LED on
 */
Led.prototype.on = function () {
  this.board.digitalWrite(this.pin, this.board.HIGH);
	this.bright = true;
}

/* 
 * Turn the LED off
 */
Led.prototype.off = function () {
  this.board.digitalWrite(this.pin, this.board.LOW);
	this.bright = false;
}

/*
 * Start a bariable blinking pattern
 */
Led.prototype.blink = function (interval) {
  interval = interval || 1000;
  var self = this;
  setInterval(function(){
    if (self.bright) {
      self.off()
    } else {
      self.on();
    }
  }, interval);
}

module.exports = Led;
