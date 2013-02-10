var events = require('events'),
    util = require('util');
 /**
 * Main JoyStick constructor
 */
/**
 * Tell the board to set it up
 * @param object options
 */
 var JoyStick = function (options) {

  if (!options || !options.board) throw new Error('Must supply required options to JoyStick');
  this.board = options.board;
  this.vrypin = options.pin || 'A0';
  this.vrxpin = options.pin || 'A1';
  this.board.pinMode(this.vrypin, 'in');
  this.board.pinMode(this.vrxpin, 'in');
  
  var self = this;

  // Poll for x and y reads
  setInterval(function () {
  	self.board.analogRead(self.vrypin);
    self.board.analogRead(self.vrxpin);
  }, 50);
  
  this.toPercentage = function(amount){
    return amount > 530 ? Math.ceil(((amount - 530) * 100) / 495) : Math.floor(( 530 - amount ) * 100 / 530);
  };

  // When data is received, parse inbound voltages and return events
  this.board.on('data', function (m) {
    m = m.slice(0, -1).split('::');
    
    var amount = self.toPercentage(m[1]);
    var real_voltage = m[1];

    if (m.length > 1 && m[0] == self.vrypin) {
      m[1] > 530 ? self.emit('y-up', amount , real_voltage) : '';
      m[1] < 500 ? self.emit('y-down', amount, real_voltage) : '';
    }
    if (m.length > 1 && m[0] == self.vrxpin) {
    	m[1] > 530 ? self.emit('x-up', amount, real_voltage) : '';
      m[1] < 500 ? self.emit('x-down', amount, real_voltage) : '';
    }

  });
	
}


/*
 * EventEmitter, I choose you!
 */
util.inherits(JoyStick, events.EventEmitter);

module.exports = JoyStick;
