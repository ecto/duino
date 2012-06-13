var events = require('events'),
    util = require('util');

/*
 * Main Servo constructor
 * Process options
 * Tell the board to set it up
 */
var Servo = function (options) {
  if (!options || !options.board) throw new Error('Must supply required options to Servo');
  this.board = options.board;
  this.pin = this.board.normalizePin(options.pin || 9);

  var types = {
    attached: true,
    detached: true,
    read: true,
    moved: true
  };

  this.board.on('ready', function () {
    console.log('board ready, attaching servo', this);
    this.attach();
  }.bind(this));

  this.board.on('data', function (message) {
    var m = message.slice(0, -1).split('::'),
        err = null,
        pin, type, data;

    if (!m.length) {
      return;
    }

    pin = m[0]
    type = m[1];
    data = m.length === 3 ? m[2] : null;

    if (pin === this.pin && types[type]) {
      this.emit(type, err, data);
    }
  }.bind(this));
};

util.inherits(Servo, events.EventEmitter);

Servo.prototype.command = function () {
  var msg = '98' + this.pin + ([].slice.call(arguments).join(''));

  // this.board.log( 'info', 'command', msg );
  this.board.write(msg);
};

Servo.prototype.detach = function () {
  this.command('00');
};

Servo.prototype.attach = function () {
  this.command('01');
};

Servo.prototype.write = function (pos) {
  pos = this.board.lpad(3, '0', pos);
  this.board.log('info', 'moving to: ' + pos);
  this.command('02' + pos);
};

Servo.prototype.read = function () {
  this.command('03');
};

// Servo.prototype.writeMilliseconds = function () {};
// Servo.prototype.attached = function (callback) {
//   this.callbacks.attached.push(callback);
// };

Servo.prototype.sweep = function (options) {
  // Ensure no missing options object
  options = options || {};

  var timeout = {
        inner: null,
        outer: null
      },
      moves = 0,
      // sweep settings
      lapse = options.lapse || 2000,
      to = options.to || 180,
      from = options.from || 1,
      // sweep handlers
      doSweep = function doSweep(pos) {
        // this.board.log('info', 'current position: ', pos);
        var moveTo,
            posint = +pos;

        // this.board.log('info', 'current pos int: ', posint);

        if (posint === 93) {
          moveTo = 1;
        } else {

          // this.board.log('info', 'posint not 93.....');

          if (posint < to) {
            moveTo = to;
          } else if (posint == to) {
            moveTo = 90;
          } else {
            moveTo = from;
          }
        }

        this.write(moveTo);

        moves++;
      };

  this.on('read', doSweep);

  // Initialize sweep; wait for for stack unwind.
  timeout.outer = setTimeout(function loop() {
    // Read the current position, will trigger
    // 'read' event with position data;
    if (moves < 2) {
      this.read();

      timeout.inner = setTimeout(loop.bind(this), lapse);
    } else {
      // this.board.log('info', 'info', 'clearing');

      clearTimeout(timeout.inner);
      clearTimeout(timeout.outer);

      loop = null;

      this.removeListener('read', doSweep);
      this.emit.call(this, 'aftersweep');
    }
  }.bind(this), 0);
};

module.exports = Servo;
