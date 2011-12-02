
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
}

/* 
 * Turn the LED off
 */
Led.prototype.off = function () {
  this.board.digitalWrite(this.pin, this.board.LOW);
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
      self.bright = false;
    } else {
      self.on();
      self.bright = true;
    }
  }, interval);
}

module.exports = Led;
