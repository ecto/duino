var events = require('events'),
    child  = require('child_process'),
    util   = require('util'),
    chalk  = require('chalk'),
    serial = require('serialport');

/*
 * The main Arduino constructor
 *
 * [NEW] Does *not* open a serial connection. Add a `setup()` call to do so.
 *
 * This allows the user to add a listener for error events that occur
 * during the serial connection attempts.
 */
var Board = function (options) {
  this.log('info', 'initializing');
  this.debug    = options && options.debug    || false;
  this.devregex = options && options.devregex || 'usb|ttyACM*|ttyS0';
  this.baudrate = options && options.baudrate || 115200;
  this.writeBuffer = [];
}

/*
 * EventEmitter, I choose you!
 */
util.inherits(Board, events.EventEmitter);

/*
 * Establish the serial connection
 *
 * Tries to open a serial connection with `connectSerial()`.
 * If successful, the connection is initialized ("clearing bytes", debug mode).
 * If unsuccessful, error event is emitted; if no listeners: error is thrown.
 */
Board.prototype.setup = function() {
  var self = this;
  this.connectSerial(function(found) {
    if (found) {
      self.serial = found;
      self.emit('connected');

      self.log('info', 'binding serial events');
      self.serial.on('data', function(data){
        self.log('receive', chalk.red(data.toString()));
        self.emit('data', data);
      });

      setTimeout(function(){
        self.log('info', 'board ready');
        self.sendClearingBytes();

        if (self.debug) {
          self.log('info', 'sending debug mode toggle on to board');
          self.write('99' + self.normalizePin(0) + self.normalizeVal(1));
          process.on('SIGINT', function(){
            self.log('info', 'sending debug mode toggle off to board');
            self.write('99' + self.normalizePin(0) + self.normalizeVal(0));
            delete self.serial;
            setTimeout(function(){
              process.exit();
            }, 100);
          });
        }

        if (self.writeBuffer.length > 0) {
          self.processWriteBuffer();
        }

        self.emit('ready');      
      }, 500);
    } else {
      msg = "Could not establish Serial connection to Arduino.";
      if (self.listeners('error').length > 0) {
        self.emit('error', msg);
      } else {
        throw new Error(msg);
      }
    }
  });
  return this;
}

/*
 * (Tries to) Open serial connection with Arduino (formerly named `detect()`)
 *
 * Loops through devices matching `devregex` and naively tries to open a serial
 * connection with each until one succeeds.
 * This should really message the device and wait for a correct response to
 * ensure that we're actually connected to an Arduino running `duino`. FIXME
 *
 * Returns false if no serial connection could be established.
 */
Board.prototype.connectSerial = function (callback) {
  this.log('info', 'attempting to find Arduino board');
  var self = this;
  child.exec('ls /dev | grep -E "'+ self.devregex +'"', function(err, stdout, stderr){

    function skipUnwanted(e) {
      return (e !== '') && (e.slice(0, 2) !== 'cu');
    }

    var devices = stdout.slice(0, -1).split('\n').filter(skipUnwanted),
        device,
        candidate;

    // loop over list of possible Arduinos
    // do not stop (even/especially on error, that's the point!) until
    //  - we run out of options, or
    //  - a serial connection is established
    var success = devices.some(function(device) {
      try {
        self.log('debug', 'attempting to open serial conn.: ' + device);
        candidate = new serial.SerialPort('/dev/' + device, {
          baudrate: self.baudrate,
          parser: serial.parsers.readline('\n')
        });

        // connection succeeded, though we don't test whether it's an Arduino
        self.log('info', 'found board at /dev/' + device);
        return true;

      } catch (e) {
        // ignore error and cont.
        self.log('warning', 'error while establishing serial connection with'
                            + '/dev/' + device + '; trying next');
        return false;
      }
    });

    if (success) {
      callback(candidate);
    } else {
      callback(false);
    }
  });
}

/*
 * The board will eat the first 4 bytes of the session
 * So we give it crap to eat
 */
Board.prototype.sendClearingBytes = function () {
  this.serial.write('00000000');
}

/*
 * Process the writeBuffer (messages attempted before serial was ready)
 */
Board.prototype.processWriteBuffer = function () {
  this.log('info', 'processing buffered messages');
  while (this.writeBuffer.length > 0) {
    this.log('info', 'writing buffered message');
    this.write(this.writeBuffer.shift());
  }
}

/*
 * Low-level serial write
 */
Board.prototype.write = function (m) {
  if (this.serial) {
    this.log('write', m);
    this.serial.write('!' + m + '.');
  } else {
    this.log('info', 'serial not ready, buffering message: ' + chalk.red(m));
    this.writeBuffer.push(m);
  }
}

// Add a 0 to the front of a single-digit pin number
Board.prototype.normalizePin = function (pin) {
  return this.lpad( 2, '0', pin );
}

// Left-pad values with 0s so it has three digits.
Board.prototype.normalizeVal = function(val) {
  return this.lpad( 3, '0', val );
}

// Left-pad `str` with `chr` and return the last `len` digits
Board.prototype.lpad = function(len, chr, str) {
  return (Array(len + 1).join(chr || ' ') + str).substr(-len);
};

/*
 * Define constants
 */
Board.prototype.HIGH = '255';
Board.prototype.LOW = '000';

/*
 * Set a pin's mode
 * val == out = 001
 * val == in  = 000
 */
Board.prototype.pinMode = function (pin, val) {
  pin = this.normalizePin(pin);
  this.log('info', 'set pin ' + pin + ' mode to ' + val);
  val = (
    val == 'out' ?
    this.normalizeVal(1) :
    this.normalizeVal(0)
  );
  this.write('00' + pin + val);
}

/*
 * Tell the board to write to a digital pin
 */
Board.prototype.digitalWrite = function (pin, val) {
  pin = this.normalizePin(pin);
  val = this.normalizeVal(val);
  this.log('info', 'digitalWrite to pin ' + pin + ': ' + chalk.green(val));
  this.write('01' + pin + val);
}

/*
 * Tell the board to extract data from a pin
 */
Board.prototype.digitalRead = function (pin) {
  pin = this.normalizePin(pin);
  this.log('info', 'digitalRead from pin ' + pin);
  this.write('02' + pin + this.normalizeVal(0));
}

Board.prototype.analogWrite = function (pin, val) {
	pin = this.normalizePin(pin);
	val = this.normalizeVal(val);
	this.log('info', 'analogWrite to pin ' + pin + ': ' + chalk.green(val));
	this.write('03' + pin + val);
}
Board.prototype.analogRead = function (pin) {
	pin = this.normalizePin(pin);
	this.log('info', 'analogRead from pin ' + pin);
	this.write('04' + pin + this.normalizeVal(0));
}

/*
 * Utility function to pause for a given time
 */
Board.prototype.delay = function (ms) {
  ms += Date.now();
  while (Date.now() < ms) { }
}

/*
 * Logger utility function
 */
Board.prototype.log = function (/*level, message*/) {
  var args = [].slice.call(arguments);
  if (this.debug) {
    console.log(chalk.gray(Date.now()) + chalk.blue(' duino ') + chalk.magenta(args.shift()) + ' ' + args.join(', '));
  }
}

module.exports = Board;
