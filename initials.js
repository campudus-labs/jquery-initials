'use strict';

(function ($) {
    $.fn.initials = function (nameShortener) {
        var name = $(this).text();

        var outer = $('<div>' + nameShortener(name) + '</div>');

        var color = colorize(name);

        var brightness = calcBrightness(color);
        // background shouldn't be to dark or to bright
        color = (brightness < 50) ? colorLuminance(color, 2) : "#" + color;
        color = (brightness > 300) ? colorLuminance(color, -0.2) : color;

        var borderColor;
        if (brightness < 50) {
            // the darker the brighter the color should be
            borderColor = colorLuminance(color, 5);
        } else if (brightness < 150) {
            borderColor = colorLuminance(color, 1.2);
        } else {
            borderColor = colorLuminance(color, -0.3);
        }

        // we don't just want the simple black or white
        var fontColor = borderColor;

        outer.css("background-color", color);
        outer.css("color", fontColor);
        outer.css("border", "2px solid " + borderColor);

        // move to css file
        outer.css("font-family", "'Helvetica Neue', Helvetica, Arial, sans-serif");
        outer.css("height", "40px");
        outer.css("width", "40px");
        outer.css("line-height", "40px");
        outer.css("font-size", "20px");
        outer.css("text-align", "center");
        outer.css("border-radius", "50%");
        outer.css("vertical-align", "middle");

        var outerOuter = $('<div></div>');

        outerOuter.insertBefore($(this));

        outerOuter.append(outer);
        outerOuter.append($(this));

        /**
         *
         * @param str
         * @returns {string}
         */
        function colorize(str) {
            // calculate hash
            for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash)) {}
            var color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
            return new Array(6 - color.length + 1).join('0') + color;
        }

        /**
         * Calculates the brightness of hexcolor.
         *
         * @param {string} hexcolor
         * @returns {number} between 0 (black) and 254.9 (white)
         */
        function calcBrightness(hexcolor) {
            var r = parseInt(hexcolor.substr(0,2),16);
            var g = parseInt(hexcolor.substr(2,2),16);
            var b = parseInt(hexcolor.substr(4,2),16);

            return Math.sqrt(
                r * r * .299 +
                g * g * .587 +
                b * b * .114);
        }

        /**
         *
         * @param hex
         * @param lum
         * @returns {string}
         */
        function colorLuminance(hex, lum) {
            // validate hex string
            hex = String(hex).replace(/[^0-9a-f]/gi, '');
            if (hex.length < 6) {
                hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
            }
            lum = lum || 0;

            // convert to decimal and change luminosity
            var rgb = "#", c, i;
            for (i = 0; i < 3; i++) {
                c = parseInt(hex.substr(i*2,2), 16);
                c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
                rgb += ("00"+c).substr(c.length);
            }

            return rgb;
        }
    };
}(jQuery));
