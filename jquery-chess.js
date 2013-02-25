;(function( $ ) {
    /**
     * Extends JQuery to include some methods for chess games.
     */
    $.fn.extend({
        chessboard: function(options) {
            var defaults = {
                showHeader: true,
                showFooter: true,
                squareSize: '40px',
                showCaptured: true,
                clearInside: true,
		blackSquareColor: '#ddd',
		whiteSquareColor: '#eee',
                onPieceSelect: function() {},
                onPieceMoveStart: function() {},
                onPieceMoveEnd: function () {}
            };
            var options = $.extend(defaults, options);
	    var pieces = [];

            var pieceHTML = {
                'WK': '&#9812',
                'WQ': '&#9813',
                'WR': '&#9814',
                'WB': '&#9815',
                'WN': '&#9816',
                'WP': '&#9817',
                'BK': '&#9818',
                'BQ': '&#9819',
                'BR': '&#9820',
                'BB': '&#9821',
                'BN': '&#9822',
                'BP': '&#9823',
            };
	    var pieces = {
		'a1': 'BR', 'b1': 'BN', 'c1': 'BB', 'd1': 'BQ',
		'e1': 'BK', 'f1': 'BB', 'g1': 'BN', 'h1': 'BR',
		'a2': 'BP', 'b2': 'BP', 'c2': 'BP', 'd2': 'BP',
		'e2': 'BP', 'f2': 'BP', 'g2': 'BP', 'h2': 'BP',
		'a7': 'WP', 'b7': 'WP', 'c7': 'WP', 'd7': 'WP',
		'e7': 'WP', 'f7': 'WP', 'g7': 'WP', 'h7': 'WP',
		'a8': 'WR', 'b8': 'WN', 'c8': 'WB', 'd8': 'WQ',
		'e8': 'WK', 'f8': 'WB', 'g8': 'WN', 'h8': 'WR',
	    };
            var rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
            var cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

	    var generateBoardHTML = function() {
		/**
		 * Internal method to generate the HTML of the board
		 */
		var $board = $('<div/>');
		for(var y = 0; y < rows.length; y++) {
		    var $row = $('<div/>');
		    for(var x = 0; x < cols.length; x++) {
			$square = $('<div/>')
			.addClass('square')
			.addClass(cols[x] + rows[y])
			.css({
			    'height': options.squareSize,
			    'width': options.squareSize,
			    'display': 'inline-block',
			    'position': 'relative'
			});
			$row.append($square);
		    }
		    $board.append($row);
		}
		$board.find('div:even div:even').css({
		    'background': options.whiteSquareColor
		});
		$board.find('div:odd div:even').css({
		    'background': options.blackSquareColor
		});
		$board.find('div:even div:odd').css({
		    'background': options.blackSquareColor
		});
		$board.find('div:odd div:odd').css({
		    'background': options.whiteSquareColor
		});
		return $board;
	    }

	    var initializePieces = function($board) {
		/**
		 * Puts the pieces in their default locations.
		 */
		var colorNames = {'B': 'black', 'W': 'white'};
		var pieceNames = {
		    'R': 'rook',
		    'N': 'knight',
		    'B': 'bishop',
		    'Q': 'queen',
		    'K': 'king',
		    'P': 'pawn'
		}
		for(var i in pieces) {
		    $piece = $('<div/>')
		    .addClass(colorNames[pieces[i][0]])
		    .addClass(pieceNames[pieces[i][1]])
		    .html(pieceHTML[pieces[i]])
		    .css({
			'font-size': options.squareSize,
			'width': '100%',
			'height': '100%',
			'text-align': 'center',
			'position': 'absolute'
		    });
		    $piece.on("click.chessboard", function() {
			validMoves($(this));
			validCaptures($(this));
		    });
		    $board.find('.' + i).append($piece);
		}
		return $board;
	    }

	    var relativeSquare = function($piece, yOffset, xOffset) {
		/**
		 * Returns the square relative to the piece.
		 * +y is forward, -y is backward, +x is right, -x is left.
		 */
		if(!xOffset) var xOffset = 0;
		if(!yOffset) var yOffset = 0;
		if(!$piece) return $();
		var $square = $piece.parent();
		var $row = $square.parent();
		var $board = $row.parent();
		var oldY = $board.children().index($row);
		var oldX = $row.children().index($square);
		if($piece.hasClass('white')) {
		    var newY = oldY - yOffset;
		}
		else {
		    var newY = oldY + yOffset;
		}
		var newX = oldX + xOffset;
		$target = $board
		    .children().eq(newY)
		    .children().eq(newX);
		return $target;
	    }

	    var validMoves = function($piece) {
		console.log($piece);
		console.log(relativeSquare($piece, 1, 0));
	    }

	    var validCaptures = function($piece) {}

            return this.each(function() {
                $(this).data({
                    options: options,
                    pieces: pieces
                });
                if(options.showHeader) {
                    var $header = $('<div/>').addClass('chessBoard-header');
                    $(this).append($header);
                }
		var $board = generateBoardHTML();
		$(this).append($board);
		initializePieces($board);
                if(options.showFooter) {
                    var $footer = $('<div/>').addClass('chessBoard-header');
                    $(this).append($footer);
                }
            });
        }
    });
})(jQuery);
