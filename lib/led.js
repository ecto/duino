
/*
 * Main LED constructor
 * Process options
 * Tell the board to set it up
 */
var Led = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.bright = 0;
  this.board.pinMode(this.pin, 'out');
  this.direction = -1;
}

/*
 * Turn the LED on
 */
Led.prototype.on = function () {
  this.board.digitalWrite(this.pin, this.board.HIGH);
	this.bright = 255;
}

/* 
 * Turn the LED off
 */
Led.prototype.off = function () {
  this.board.digitalWrite(this.pin, this.board.LOW);
	this.bright = 0;
}

Led.prototype.brightLevel = function(val) {
	this.board.analogWrite(this.pin, this.bright = Math.max(Math.min(val,255),0));
}

Led.prototype.fade = function(interval) {
	to = (interval||1000)/(255*2);
	if(bright == 0) direction = 1;
	if(bright == 255) direction = -1;
	this.brightLevel(bright += direction);
	setTimeout(this.fade(interval),to);
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
