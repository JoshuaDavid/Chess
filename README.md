jQuery Chess
==========
This plugin provides chess functionality.
Methods
----------
**init**
Creates the chessboard and moves the pieces into position. If there is a moveHistory, executes all moves in the moveHistory to bring the board up to that point. Returns a selector containing the chess board(s)
Options
----------
**showHeader**

*boolean*: Whether or not to show the header. The header contains information such as whose turn it is.

**showFooter**

*boolean*: Whether or not to show the footer. The footer shows which pieces have been taken so far.

**squareSize**

*number or string(width)*: How wide and tall each square on the chessboard should be. Units can be px, em, ex, in, pt, and so on.

**showCaptured**

*boolean*: Whether or not to show captured pieces. Not currently implemented?

**clearInside**

*boolean*: I'm not really sure what that does...

**blackSquareColor**

*string(color)*: what color the black squares should be.

**whiteSquareColor**

*string(color)*: what color the white squares should be.

**startingPosition**

*object{string(squareShortName):string(pieceShortName)}*: The starting position of the pieces on the board (before moveHistory starts). If this is left as null, the default starting position is used.

**whoseTurn**

*string("white" or "black")*: A string (either "white" or "black") saying whose turn it is.

**moveHistory**

*array[string(move)]*: An array containing strings that describe moves. Strings should be in PGN or something like it.

**onSelect**

*function($piece)*: A function that is executed when a piece is selected. If the function returns false, the piece will not be selected.

**onMoveStart**

*function($piece)*: A function that is executed before a piece moves. If the function returns false, the piece will not be moved.

**onMoveEnd**

*function($piece, move)*: A function that is executed after a piece moves. The return value of this function is not used.

