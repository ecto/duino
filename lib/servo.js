/*
 * Main Servo constructor
 * Process options
 * Tell the board to set it up
 */
var Servo = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Sutton');
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 9);
  var self = this;
  this.board.on('ready', function () {
    self.attach();
  });
}

Servo.prototype.write = function (pos) {
  this.board.write('98' + this.pin + '02' + pos);
}

Servo.prototype.attach = function () {
  this.board.write('98' + this.pin + '01');
}

Servo.prototype.read = function () {}
Servo.prototype.detach = function () {}
Servo.prototype.writeMilliseconds = function () {}
Servo.prototype.attached = function () {}

Servo.prototype.sweep = function () {
  var self = this;
  var pos = 0;
  setInterval(function() {
    self.write(pos++);
    if (pos == 180) clearInterval(this);
  }, 25);
}

module.exports = Servo;
