;(function( $ ) {
    /**
     * Extends JQuery to include some methods for chess games.
     */
    $.fn.extend({
        chessBoard: function(options) {
            var defaults = {
                /**
                 * Whether or not to show the header.
                 *
                 * The header contains information such as whose turn it is,
                 * who is playing, whether a player is in check, and so on.
                 */
                showHeader: true,
                showFooter: true,
                squareSize: '40px',
                showCaptured: true,
                clearInside: true,
                onPieceSelect: function() {},
                onPieceMoveStart: function() {},
                onPieceMoveEnd: function () {}
            };
            var options = $.extend(defaults, options);

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
            var rows = ['1', '2', '3', '4', '5', '6', '7', '8'];
            var cols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
            return this.each(function() {
                $(this).data(
                    options: options,
                    pieces: pieces
                );

                if(options.showHeader) {
                    $header = $('<div/>').addClass('chessBoard-header');
                    $(this).append($header);
                }
                

            });
        }
    });
})(jQuery);
