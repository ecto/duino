var arduino = require('../');

var board = new arduino.Board();

board.on('ready', function(){
	
	var joystick = new arduino.JoyStick({ board: board });
	 
	joystick.on('y-up',function(amount,real_volts){
		console.log('Y Increasing, amount:',amount,real_volts);
	 	
	});

	joystick.on('y-down',function(amount,real_volts){
		console.log('Y Decreasing , amount:',amount,real_volts);
	});

	joystick.on('x-up',function(amount,real_volts){
		console.log('X Increasing , amount:',amount,real_volts);
	});

	joystick.on('x-down',function(amount,real_volts){
		console.log('X Decreasing , amount:',amount,real_volts);
	});
	
});




