var arduino = require('../');
var board = new arduino.Board({
  debug: true
});



// segment in led display
var sA = new arduino.Led({
  board: board,
  pin: 8
});

var sB = new arduino.Led({
  board: board,
  pin: 9
});
var sC = new arduino.Led({
  board: board,
  pin: 2
});
var sD = new arduino.Led({
  board: board,
  pin: 3
});
var sE = new arduino.Led({
  board: board,
  pin: 4
});
var dot = new arduino.Led({
  board: board,
  pin: 5
});
var sG = new arduino.Led({
  board: board,
  pin: 6
});

var sF = new arduino.Led({
  board: board,
  pin: 7
});

function shownumber(number){
	switch(number){
		case 0:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.off(); //  -
		    sE.on(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 1:
			sA.off(); //  -
		    sB.on(); //   |
		    sG.off(); // |
		    sF.off(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.off(); //  -
		    dot.off();//   .
		break;
		case 2:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.off(); // |
		    sF.on(); //  -
		    sE.on(); // |
		    sC.off(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 3:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.off(); // |
		    sF.on(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 4:
			sA.off(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.off(); //  -
		    dot.off();//   .
		break;
		case 5:
			sA.on(); //  -
		    sB.off(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 6:
			sA.off(); //  -
		    sB.off(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.on(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 7:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.off(); // |
		    sF.off(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.off(); //  -
		    dot.off();//   .
		break;
		case 8:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.on(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 9:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.off(); // |
		    sC.on(); //   |
		    sD.off(); //  -
		    dot.off();//   .
		break;
	}
}

function hello(step){
	switch(step){
		case 0:
			sA.off(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.on(); // |
		    sC.on(); //   |
		    sD.off(); //  -
		    dot.off();//   .
		break;
		case 1:
			sA.on(); //  -
		    sB.off(); //   |
		    sG.on(); // |
		    sF.on(); //  -
		    sE.on(); // |
		    sC.off(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 2:
			sA.off(); //  -
		    sB.off(); //   |
		    sG.on(); // |
		    sF.off(); //  -
		    sE.on(); // |
		    sC.off(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 3:
			sA.off(); //  -
		    sB.off(); //   |
		    sG.on(); // |
		    sF.off(); //  -
		    sE.on(); // |
		    sC.off(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
		case 4:
			sA.on(); //  -
		    sB.on(); //   |
		    sG.on(); // |
		    sF.off(); //  -
		    sE.on(); // |
		    sC.on(); //   |
		    sD.on(); //  -
		    dot.off();//   .
		break;
	}

}

function snake(step){
	
	switch(step){
		case 0:
			sG.off(); 
			sD.off(); //  -
			sA.on(); //  -
		break;
		case 1:
			sA.off();
			sB.on(); //   |
		    
		break;
		case 2:
			sB.off(); //   |
			sF.on(); //  -
		    
		break;
		case 3:
			sF.off(); //  -
			sE.on(); // |
		break;
		case 4:
			sE.off(); // |
			sD.on(); //  -
		break;
		case 5:
			sD.off(); // |
			sC.on(); 
		break;
		case 6:
			sC.off(); // |
			sF.on(); 
		break;
		case 7:
			sF.off(); // |
			sG.on(); 
		break;

	}
}

board.on('ready', function(){


  	var number = 0;
	var showtime = function() {
		if (number <= 7){
	    	snake(number);
	    	number++
	    } else {
	    	number = 0;
	    }
	};


	// var showtime = function() {
	// 	if (number <= 4){
	//     	hello(number);
	//     	number++
	//     } else {
	//     	number = 0;
	//     }
	// };
	


	// var showtime = function() {
	//     if (number <= 9){
	//     	shownumber(number);
	//     	number++
	//     } else {
	//     	number = 0;
	//     }
	    
	// }


	setInterval( showtime, 100 );
});


