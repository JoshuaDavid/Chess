$(document).ready(function() {
    // Variables beginning with $ are DOM elements.
    // All other variables are not.
    $board = generateBoard();
    $('body').append($board);
    showPieces();
    $('.piece').live('click touchstart', function() {
	$(this).showValidMoves();
    })
    $('.valid').live('click touchstart', function() {
	$('.active').moveTo($(this));
    });
});
pieces = [/*{*/
    {'location': 'a1', 'type': 'R', 'color': 'black', 'symbol': '&#9820'},
    {'location': 'b1', 'type': 'N', 'color': 'black', 'symbol': '&#9822'},
    {'location': 'c1', 'type': 'B', 'color': 'black', 'symbol': '&#9821'},
    {'location': 'd1', 'type': 'Q', 'color': 'black', 'symbol': '&#9819'},
    {'location': 'e1', 'type': 'K', 'color': 'black', 'symbol': '&#9818'},
    {'location': 'f1', 'type': 'B', 'color': 'black', 'symbol': '&#9821'},
    {'location': 'g1', 'type': 'N', 'color': 'black', 'symbol': '&#9822'},
    {'location': 'h1', 'type': 'R', 'color': 'black', 'symbol': '&#9820'},
    {'location': 'a2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'b2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'c2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'd2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'e2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'f2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'g2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'h2', 'type': 'P', 'color': 'black', 'symbol': '&#9823'},
    {'location': 'a7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'b7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'c7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'd7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'e7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'f7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'g7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'h7', 'type': 'P', 'color': 'white', 'symbol': '&#9817'},
    {'location': 'a8', 'type': 'R', 'color': 'white', 'symbol': '&#9814'},
    {'location': 'b8', 'type': 'N', 'color': 'white', 'symbol': '&#9816'},
    {'location': 'c8', 'type': 'B', 'color': 'white', 'symbol': '&#9815'},
    {'location': 'd8', 'type': 'Q', 'color': 'white', 'symbol': '&#9813'},
    {'location': 'e8', 'type': 'K', 'color': 'white', 'symbol': '&#9812'},
    {'location': 'f8', 'type': 'B', 'color': 'white', 'symbol': '&#9815'},
    {'location': 'g8', 'type': 'N', 'color': 'white', 'symbol': '&#9816'},
    {'location': 'h8', 'type': 'R', 'color': 'white', 'symbol': '&#9814'},
];/*}*/
for(var i = 0; i < pieces.length; i++) {
    if(pieces[i]['type'] == 'P') {
	pieces[i]['canJump'] = true;
    }
}
function generateBoard() {
    // Generates the html of the board itself
    var squares = [/*{*/
	['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'],
	['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
	['a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3'],
	['a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4'],
	['a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5'],
	['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
	['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
	['a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8']
    /*}*/];
    var $board = $('<div class="board"/>');
    for(var y = 0; y < squares.length; y++) {
	var row = squares[y];
	var $row = $('<div class="row"/>');
	for(var x = 0; x < row.length; x++) {
	    var square = row[x];
	    var $square = $('<div class="square '+square+'"/>');
	    $row.append($square);
	}
	$board.append($row);
    }
    return $board;
}
function showPieces() {
    $('.piece').remove();
    for(var i = 0; i < pieces.length; i++) {
	$piece = $('<div class="piece">');
	$piece.addClass(pieces[i]['color']);
	$piece.addClass(pieces[i]['type']);
	$piece.html(pieces[i]['symbol']);
	$('.' + pieces[i]['location']).append($piece);
    }
}
function toXY(loc) {
    var cols = {'a': 0, 'b': 1, 'c': 2, 'd': 3, 'e': 4, 'f': 5 , 'g': 6, 'h': 7};
    var x = cols[loc[0]];
    var y = parseInt(loc[1]) - 1;
    return {x: x, y: y};
}
function toLoc(xy) {
    // Takes an xy coordinate and converts it into a string location
    var loc = '';
    var cols = { 0:'a',  1:'b',  2:'c',  3:'d',  4:'e',  5 :'f',  6:'g',  7:'h'};
    loc += cols[xy.x];
    loc += (xy.y + 1);
    return loc;
	    
}
$.fn.validMoves = function($piece) {
    // Return a selector with the valid moves for that piece.
    var $moves = $();
    
}
$.fn.showValidMoves = function() {
    if($('.active').length > 0) {
	$('.active').capture($(this));	
    }
    var moves = [];
    var $piece = $(this);
    var $square = $piece.parent();
    var color = $piece.hasClass('white') ? 'white' : 'black';
    var loc = $square.attr('class').split(' ')[1];
    var xy = toXY(loc);
    if($piece.hasClass('P')) {
	moves = validPawnMoves(xy.x, xy.y, color);
    }
    $('.valid').removeClass('valid');
    for(var i = 0; i < moves.length; i++) {
	$('.'+moves[i]).addClass('valid');
    }
    if(moves.length > 0) {
	$('.active').removeClass('active');    
	$piece.addClass('active');
    }
    return moves;
}
$.fn.moveTo = function($square) {
    var $piece = $(this);
    if($square.hasClass('piece')) {
	// We are trying to take another piece. Make sure that we
	// actually are allowed to do that, then do it.

	// Todo: allow captures
	return false;
    }
    $square.append($piece);
    $('.valid').removeClass('valid');
    $('.active').removeClass('active');    
}
$.fn.capture = function($victim) {
    var $attacker = $(this);
    console.log($attacker, 'is attempting to take', $victim);
    return false;
}
function validPawnMoves(x, y, color) {
    // Returns the valid moves for a pawn of a specific color at a
    // specific x, y location.
    var moves = [];
    if(color == 'white') {
	if(y == 6 && !occupant(x,y-1) && !occupant(x,y-2)) {
	    // The pawn has not yet moved and there is nothing in
	    // the space in front of it or the space after that
	    moves.push(toLoc({x: x, y: y-2}));
	}
	if(!occupant(x, y-1)) {
	    moves.push(toLoc({x: x, y: y-1}));
	}
	if(occupant(x-1, y-1)) {
	    if(occupant(x-1, y-1).hasClass('black')) {
		moves.push(toLoc({x: x-1, y: y-1}));
	    }
	}
	if(occupant(x+1, y-1)) {
	    if(occupant(x+1, y-1).hasClass('black')) {
		moves.push(toLoc({x: x+1, y: y-1}));
	    }
	}
    }
    else {
	if(y == 1 && !occupant(x,y+1) && !occupant(x,y+2)) {
	    // The pawn has not yet moved and there is nothing in
	    // the space in front of it or the space after that
	    moves.push(toLoc({x: x, y: y+2}));
	}
	if(!occupant(x, y+1)) {
	    moves.push(toLoc({x: x, y: y+1}));
	}
    }
    return moves;
}
function occupant(x, y) {
    // Says whether or not this space is empty. Can take x, y 
    // coordinates or location strings.
    if(!x && x !== 0) return false;
    if(!y && x.match(/^[a-h][1-8]$/g)) {
	// A location string was passed in.
	var loc = x;
    }
    else var loc = toLoc({x: x, y: y});
    var $square = $('.'+loc);
    if($square.children().length == 0) return false;
    else return $square.children().eq(0);
}
function kingIsInCheck(color) {
    // Todo: implement this.
    return false;
}
