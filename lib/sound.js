var Sound = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to LED');
  this.board = options.board;
  this.pin = options.pin || 8;
  this.board.pinMode(this.pin, 'out');
}

Sound.prototype.tone = function(tone,duration) {
   this.board.write('95' + this.board.lpad(2, '0', this.pin) + this.board.lpad(6,'0',tone)); 
   this.board.write('96' + this.board.lpad(2, '0', this.pin) + this.board.lpad(6,'0',duration)); 
}

module.exports = Sound;
