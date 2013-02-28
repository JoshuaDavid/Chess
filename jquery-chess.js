;(function( $ ) {
    /**
     * Extends JQuery to include some methods for chess games.
     */
    $.fn.extend({
        chessboard: function(func, options) {
            if(!options) {
                if(typeof func === "object" && func) {
                    var options = func;
                    var func = 'init';
                }
                if(!func) {
                    var func = 'init';
                    var options = {};
                }
            }
            var defaults = {
                showHeader: true,
                showFooter: true,
                squareSize: '40px',
                showCaptured: true,
                clearInside: true,
                blackSquareColor: '#ddd',
                whiteSquareColor: '#eee',
                startingPosition: null,
                whoseTurn: 'white',
                moveHistory: [],
                onSelect: function($piece) {},
                onMoveStart: function($piece) {},
                onMoveEnd: function ($piece) {}
            };
            if (typeof options == 'string') {
                var paramStr = options;
                var options = $(this).data('options');
            }
            else {
                var options = $.extend(defaults, options);
            }
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
            var pieces = options.startingPosition;
            if(!pieces) {
                var pieces = {
                    'a8': 'BR', 'b8': 'BN', 'c8': 'BB', 'd8': 'BQ',
                    'e8': 'BK', 'f8': 'BB', 'g8': 'BN', 'h8': 'BR',
                    'a7': 'BP', 'b7': 'BP', 'c7': 'BP', 'd7': 'BP',
                    'e7': 'BP', 'f7': 'BP', 'g7': 'BP', 'h7': 'BP',
                    'a2': 'WP', 'b2': 'WP', 'c2': 'WP', 'd2': 'WP',
                    'e2': 'WP', 'f2': 'WP', 'g2': 'WP', 'h2': 'WP',
                    'a1': 'WR', 'b1': 'WN', 'c1': 'WB', 'd1': 'WQ',
                    'e1': 'WK', 'f1': 'WB', 'g1': 'WN', 'h1': 'WR',
                };
            }
            var rows = ['8', '7', '6', '5', '4', '3', '2', '1'];
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
                $board.children('div:even').children('div:even').css({
                    'background': options.whiteSquareColor
                }).end().end()
                .children('div:odd').children('div:even').css({
                    'background': options.blackSquareColor
                }).end().end()
                .children('div:even').children('div:odd').css({
                    'background': options.blackSquareColor
                }).end().end()
                .children('div:odd').children('div:odd').css({
                    'background': options.whiteSquareColor
                }).end().end()
                .children().children()
                    .on('click.chessboard', handleSquareClick);
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
                        })
                    .on("click.chessboard", handlePieceClick);
                    $board.find('.' + i).append($piece);
                }
                return $board;
            }

            var executeMove = function(move) {
                /**
                 * Execute a move from options.moveHistory
                 */
                switch(move[0]) {
                    case 'N':
                        var pieceType = 'knight';
                        var move = move.substring(1)
                        break;
                    case 'B':
                        var pieceType = 'bishop';
                        var move = move.substring(1)
                        break;
                    case 'R':
                        var pieceType = 'rook';
                        var move = move.substring(1)
                        break;
                    case 'Q':
                        var pieceType = 'queen';
                        var move = move.substring(1)
                        break;
                    case 'K':
                        var pieceType = 'king';
                        var move = move.substring(1)
                        break;
                    default:
                        var pieceType = 'pawn';
                        break;
                }
                var $pieces = $('.' + options.whoseTurn);
                $pieces = $pieces.filter('.' + pieceType);
                var $piece = $([]);
                var $target = $('.' + move.substr(move.length - 2));
                move = move.substr(0, move.length - 2, $target);
                if(move[move.length-1] == 'x') {
                    var isCapture = true;
                    move = move.substr(0, move.length -1)
                }
                else var isCapture = false;
                var $from = $('.square').filter(function() {
                    return squareName($(this)).indexOf(move) >= 0;
                });
                for(var i = 0; i < $pieces.length; i++) {
                    var $p = $pieces.eq(i);
                    var $sq = $p.parent();
                    if(!isCapture && validMoves($p).index($target) >= 0) {
                        if($from.index($sq)) $piece = $piece.add($p);
                    }
                    if(isCapture && validCaptures($p).index($target) >= 0) {
                        if($from.index($sq)) $piece = $piece.add($p);
                    }
                }
                if($piece.length !== 1) {
                    console.log('There must be exactly one possible piece');
                    console.log($piece);
                    return false;
                }
                if(!isCapture) moveTo($piece, $target);
                else capture($piece, $target.children().eq(0));
                options.moveHistory.pop();
                nextTurn();
            }

            var handlePieceClick = function() {
                if($(this).hasClass(options.whoseTurn)) {
                    if(options.onSelect($(this)) == false) return false;
                    $('.chessboard-active-piece')
                        .removeClass('chessboard-active-piece');
                    $(this).addClass('chessboard-active-piece');
                    removeHighlighting();
                    validMoves($(this))
                        .addClass('chessboard-valid-move');
                    validCaptures($(this))
                        .addClass('chessboard-valid-capture');
                }
                else if($(this).parent().hasClass('chessboard-valid-capture')) {
                    var $active = $('.chessboard-active-piece');
                    capture($active, $(this));
                    nextTurn();
                }
                return false;
            }

            var kill = function($piece) {
                $piece
                    .css({
                        'position': '',
                        'height': '',
                        'width': '',
                        'text-align': '',
                        'display': 'inline'
                    })
                    .off('.chessboard');
                if($piece.hasClass('white')) {
                    $piece.appendTo('.chessboard-white-captured');
                }
                else {
                    $piece.appendTo('.chessboard-black-captured');
                }
            }

            var handleSquareClick = function() {
                var $piece = $('.chessboard-active-piece');
                if($(this).hasClass('chessboard-valid-move')) {
                    if($(this).children().length == 0) {
                        moveTo($piece, $(this));
                        nextTurn();
                    }
                }
                return false;
            }

            var squareName = function($square) {
                var classes = $square.attr('class').split(' ');
                var isNext = false;
                for(var i = 0; i < classes.length; i++) {
                    if(isNext == true) return classes[i];
                    isNext = (classes[i] == 'square');
                }
                return false;
            }

            var shortName = function($piece) {
                if($piece.hasClass('pawn')) return '';
                if($piece.hasClass('knight')) return 'N';
                if($piece.hasClass('bishop')) return 'B';
                if($piece.hasClass('rook')) return 'R';
                if($piece.hasClass('queen')) return 'Q';
                if($piece.hasClass('king')) return 'K';
            }

            var moveTo = function($piece, $target) {
                if(options.onMoveStart($piece) === false) return false;
                var $origin = $piece.parent();
                $target.html($piece);
                options.moveHistory.push(shortName($piece) + squareName($target));
                options.onMoveEnd($piece, options.moveHistory.slice(-1)[0]);
            }

            var capture = function($piece, $victim) {
                var $origin = $piece.parent();
                var $target = $victim.parent();
                options.moveHistory.push(shortName($piece) + 'x' + squareName($target));
                kill($victim.clone());
                $target.html($piece);
                options.onMoveEnd($piece, options.moveHistory.slice(-1)[0]);
            }

            var capFirst = function(string) {
                return string[0].toUpperCase() + string.substring(1);
            }

            var nextTurn = function() {
                removeHighlighting();
                $('.chessboard-active-piece')
                    .removeClass('chessboard-active-piece');
                if(options.whoseTurn == 'white') {
                    options.whoseTurn = 'black';
                }
                else {
                    options.whoseTurn = 'white';
                }
                    $('.chessboard-turn-shower')
                        .html(capFirst(options.whoseTurn)+"'s Turn");
                return;
            }

            var removeHighlighting = function() {
                $('.chessboard-valid-move')
                    .removeClass('chessboard-valid-move');
                $('.chessboard-valid-capture')
                    .removeClass('chessboard-valid-capture');
                return;
            }

            var relativeSquare = function($piece, yOffset, xOffset) {
                /**
                 * Returns the square relative to the piece.
                 * +y is forward, -y is backward, +x is right, -x is left.
                 */
                if(!xOffset) var xOffset = 0;
                if(!yOffset) var yOffset = 0;
                if(!$piece) return $([]);
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
                if(newX < 0 || newY < 0) return $([]);
                $target = $board
                    .children().eq(newY)
                    .children().eq(newX);
                return $target;
            }

            var validMoves = function($piece) {
                var $moves = $([]);
                var validKingMoves = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, -1, -1));
                    $moves = $moves.add(relativeSquare($piece, 0, -1));
                    $moves = $moves.add(relativeSquare($piece, 1, -1));
                    $moves = $moves.add(relativeSquare($piece, -1, 0));
                    $moves = $moves.add(relativeSquare($piece, 1, 0));
                    $moves = $moves.add(relativeSquare($piece, -1, 1));
                    $moves = $moves.add(relativeSquare($piece, 0, 1));
                    $moves = $moves.add(relativeSquare($piece, 1, 1));
                    return $moves;
                }
                var validQueenMoves = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(validRookMoves($piece))
                        $moves = $moves.add(validBishopMoves($piece))
                        return $moves;
                }
                var validRookMoves = function($piece) {
                    var $moves = $([]);
                    var x = 1;
                    while(!relativeSquare($piece, 0, x).children().length) {
                        if(!relativeSquare($piece, 0, x).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, 0, x));
                        x++;
                    }
                    var x = -1;
                    while(!relativeSquare($piece, 0, x).children().length) {
                        if(!relativeSquare($piece, 0, x).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, 0, x));
                        x--;
                    }
                    var y = 1;
                    while(!relativeSquare($piece, y, 0).children().length) {
                        if(!relativeSquare($piece, y, 0).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, y, 0));
                        y++;
                    }
                    var y = -1;
                    while(!relativeSquare($piece, y, 0).children().length) {
                        if(!relativeSquare($piece, y, 0).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, y, 0));
                        y--;
                    }
                    return $moves;
                }
                var validBishopMoves = function($piece) {
                    var $moves = $([]);
                    var i = 1;
                    while(!relativeSquare($piece, i, i).children().length) {
                        if(!relativeSquare($piece, i, i).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, i, i));
                        i++;
                    }
                    var i = -1;
                    while(!relativeSquare($piece, i, i).children().length) {
                        if(!relativeSquare($piece, i, i).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, i, i));
                        i--;
                    }
                    var i = 1;
                    while(!relativeSquare($piece, i, -i).children().length) {
                        if(!relativeSquare($piece, i, -i).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, i, -i));
                        i++;
                    }
                    var i = -1;
                    while(!relativeSquare($piece, i, -i).children().length) {
                        if(!relativeSquare($piece, i, -i).length) {
                            break;
                        }
                        $moves = $moves.add(relativeSquare($piece, i, -i));
                        i--;
                    }
                    return $moves;
                }
                var validKnightMoves = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, -2, -1));
                    $moves = $moves.add(relativeSquare($piece, -1, -2));
                    $moves = $moves.add(relativeSquare($piece, -2, 1));
                    $moves = $moves.add(relativeSquare($piece, -1, 2));
                    $moves = $moves.add(relativeSquare($piece, 2, -1));
                    $moves = $moves.add(relativeSquare($piece, 1, -2));
                    $moves = $moves.add(relativeSquare($piece, 2, 1));
                    $moves = $moves.add(relativeSquare($piece, 1, 2));
                    return $moves;
                }
                var validPawnMoves = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, 1, 0));
                    if(!relativeSquare($piece, -2, 0).length) {
                        $moves = $moves.add(relativeSquare($piece, 2, 0));
                    }
                    return $moves;
                }
                if($piece.hasClass(options.whoseTurn)) {
                    if($piece.hasClass('king')) {
                        $moves = $moves.add(validKingMoves($piece));
                    }
                    if($piece.hasClass('queen')) {
                        $moves = $moves.add(validQueenMoves($piece));
                    }
                    if($piece.hasClass('rook')) {
                        $moves = $moves.add(validRookMoves($piece));
                    }
                    if($piece.hasClass('bishop')) {
                        $moves = $moves.add(validBishopMoves($piece));
                    }
                    if($piece.hasClass('knight')) {
                        $moves = $moves.add(validKnightMoves($piece));
                    }
                    if($piece.hasClass('pawn')) {
                        $moves = $moves.add(validPawnMoves($piece));
                    }
                }
                $moves.each(function() {
                    if($(this).children().length !== 0) {
                        // If a square is not empty, you can't moveTo there if
                        // you're not capturing a piece.
                        $moves = $moves.not(this);
                    }
                });
                return $moves;
            }

            var validCaptures = function($piece) {
                var validKingCaptures = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, -1, -1));
                    $moves = $moves.add(relativeSquare($piece, 0, -1));
                    $moves = $moves.add(relativeSquare($piece, 1, -1));
                    $moves = $moves.add(relativeSquare($piece, -1, 0));
                    $moves = $moves.add(relativeSquare($piece, 1, 0));
                    $moves = $moves.add(relativeSquare($piece, -1, 1));
                    $moves = $moves.add(relativeSquare($piece, 0, 1));
                    $moves = $moves.add(relativeSquare($piece, 1, 1));
                    return $moves;
                }
                var validQueenCaptures = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(validRookCaptures($piece))
                        $moves = $moves.add(validBishopCaptures($piece))
                        return $moves;
                }
                var validRookCaptures = function($piece) {
                    var $moves = $([]);
                    var x = 1;
                    while(!relativeSquare($piece, 0, x).children().length) {
                        if(!relativeSquare($piece, 0, x).length) {
                            break;
                        }
                        x++;
                    }
                    $moves = $moves.add(relativeSquare($piece, 0, x));
                    var x = -1;
                    while(!relativeSquare($piece, 0, x).children().length) {
                        if(!relativeSquare($piece, 0, x).length) {
                            break;
                        }
                        x--;
                    }
                    $moves = $moves.add(relativeSquare($piece, 0, x));
                    var y = 1;
                    while(!relativeSquare($piece, y, 0).children().length) {
                        if(!relativeSquare($piece, y, 0).length) {
                            break;
                        }
                        y++;
                    }
                    $moves = $moves.add(relativeSquare($piece, y, 0));
                    var y = -1;
                    while(!relativeSquare($piece, y, 0).children().length) {
                        if(!relativeSquare($piece, y, 0).length) {
                            break;
                        }
                        y--;
                    }
                    $moves = $moves.add(relativeSquare($piece, y, 0));
                    return $moves;
                }
                var validBishopCaptures = function($piece) {
                    var $moves = $([]);
                    var i = 1;
                    while(!relativeSquare($piece, i, i).children().length) {
                        if(!relativeSquare($piece, i, i).length) {
                            break;
                        }
                        i++;
                    }
                    $moves = $moves.add(relativeSquare($piece, i, i));
                    var i = -1;
                    while(!relativeSquare($piece, i, i).children().length) {
                        if(!relativeSquare($piece, i, i).length) {
                            break;
                        }
                        i--;
                    }
                    $moves = $moves.add(relativeSquare($piece, i, i));
                    var i = 1;
                    while(!relativeSquare($piece, i, -i).children().length) {
                        if(!relativeSquare($piece, i, -i).length) {
                            break;
                        }
                        i++;
                    }
                    $moves = $moves.add(relativeSquare($piece, i, -i));
                    var i = -1;
                    while(!relativeSquare($piece, i, -i).children().length) {
                        if(!relativeSquare($piece, i, -i).length) {
                            break;
                        }
                        i--;
                    }
                    $moves = $moves.add(relativeSquare($piece, i, -i));
                    return $moves;
                }
                var validKnightCaptures = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, -2, -1));
                    $moves = $moves.add(relativeSquare($piece, -1, -2));
                    $moves = $moves.add(relativeSquare($piece, -2, 1));
                    $moves = $moves.add(relativeSquare($piece, -1, 2));
                    $moves = $moves.add(relativeSquare($piece, 2, -1));
                    $moves = $moves.add(relativeSquare($piece, 1, -2));
                    $moves = $moves.add(relativeSquare($piece, 2, 1));
                    $moves = $moves.add(relativeSquare($piece, 1, 2));
                    return $moves;
                }
                var validPawnCaptures = function($piece) {
                    var $moves = $([]);
                    $moves = $moves.add(relativeSquare($piece, 1, -1));
                    $moves = $moves.add(relativeSquare($piece, 1, 1));
                    return $moves;
                }
                var $moves = $([]);
                if($piece.hasClass(options.whoseTurn)) {
                    if($piece.hasClass('king')) {
                        $moves = $moves.add(validKingCaptures($piece));
                    }
                    if($piece.hasClass('queen')) {
                        $moves = $moves.add(validQueenCaptures($piece));
                    }
                    if($piece.hasClass('rook')) {
                        $moves = $moves.add(validRookCaptures($piece));
                    }
                    if($piece.hasClass('bishop')) {
                        $moves = $moves.add(validBishopCaptures($piece));
                    }
                    if($piece.hasClass('knight')) {
                        $moves = $moves.add(validKnightCaptures($piece));
                    }
                    if($piece.hasClass('pawn')) {
                        $moves = $moves.add(validPawnCaptures($piece));
                    }
                }
                $moves.each(function() {
                    if($(this).children().length == 0) {
                        // If a square is empty, you can't capture the piece
                        // in that square.
                        $moves = $moves.not(this);
                    }
                    if($(this).children().hasClass(options.whoseTurn)) {
                        // You can't capture your own pieces.
                        $moves = $moves.not(this);
                    }
                });
                return $moves;
            }

            return this.each(function() {
                if(func == 'init') {
                    $(this).data({
                        options: options,
                        pieces: pieces
                    });
                    if(options.showHeader) {
                        var $header = $('<div/>').addClass('chessBoard-header');
                        var $turnShower = $('<h1/>')
                            .addClass('chessboard-turn-shower')
                            .css({'text-align': 'center'})
                            .html(capFirst(options.whoseTurn)+"'s Turn");
                        $header.append($turnShower);
                        $(this).append($header);
                    }
                    var $board = generateBoardHTML();
                    $(this).append($board);
                    initializePieces($board);
                    $board.css({
                    });
                    if(options.showFooter) {
                        var $footer = $('<div/>').addClass('chessBoard-footer');
                        $whiteCaptured = $('<div/>')
                            .addClass('chessboard-white-captured')
                            .css({
                                'width': $board.height() / 2 + 'px',
                                'display': 'inline-block',
                            });
                        $blackCaptured = $('<div/>')
                            .addClass('chessboard-black-captured')
                            .css({
                                'width': $board.height() / 2 + 'px',
                                'display': 'inline-block',
                            });
                        $footer.append($whiteCaptured);
                        $footer.append($blackCaptured);
                        $(this).append($footer);
                    }
                    for(var i = 0; i < options.moveHistory.length; i++) {
                        executeMove(options.moveHistory[i]);
                    }
                }
                if(func == 'move') {
                    console.log(paramStr);
                    if(paramStr.length <= 7) {
                        executeMove(paramStr);
                    }
                }
            });
        }
    });
})(jQuery);
