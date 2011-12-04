
/*
 * Main Pieze constructor
 * Process options
 * Tell the board to set pin mode
 */
var Piezo = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Piezo');
  this.board = options.board;
  this.pin = options.pin || 13;
  this.bright = false;
  this.board.pinMode(this.pin, 'out');
}

/*
 * Send a square wave to the speaker for a given duration
 */
Piezo.prototype.tone = function (tone, duration) {
  this.board.log('info', 'starting tone ' + tone.toString().green + ' for ' + duration.toString().green + ' milliseconds');

  var self = this,
      tone = Math.floor(tone / 1000); // timeHigh is in microseconds and our delay() function is in milliseconds
      i = 0;

  setInterval(function(){
    if (self.bright) {
      self.board.digitalWrite(self.pin, self.board.LOW);
      self.bright = false;
    } else {
      self.board.digitalWrite(self.pin, self.board.HIGH);
      self.bright = true;
    }

    if (i++ >= duration) {
      self.board.log('info', 'tone end');
      clearInterval(this);
    }
  }, tone);

}

/*
 * Play a tone for a given duration to create a note
 *
 * timeHigh = period / 2 = 1 / (2 * toneFrequency)
 *
 * note   frequency   period   timeHigh
 *  c       261hz      3830      1915
 *  d       294hz      3400      1700
 *  e       329hz      3038      1519
 *  f       349hz      2854      1432
 *  g       392hz      2550      1275
 *  a       440hz      2272      1136
 *  b       493hz      2028      1014
 *  c       523hz      1912       956
 */
Piezo.prototype.note = function (note, duration) {
  this.board.log('info', 'playing note ' + note.green + ' for ' + duration.toString().green + ' milliseconds');
  var notes = {
    'c': 1915,
    'd': 1700,
    'e': 1519,
    'f': 1432,
    'g': 1275,
    'a': 1136,
    'b': 1014,
    'c': 956
  };
  this.tone(notes[note], duration);
}

module.exports = Piezo;
