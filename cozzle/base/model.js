define(["require", "exports", "cozzle/base/algorithms"], function(require, exports, alg) {
    

    // ==== Cozzle Color ===
    /** Basic Color Representation. No Alpha - set alpha somewhere else */
    var CozzleColor = (function () {
        function CozzleColor(r, g, b) {
            this._r = this.validate(r);
            this._g = this.validate(g);
            this._b = this.validate(b);
        }
        CozzleColor.prototype.R = function () {
            return this._r;
        };
        CozzleColor.prototype.G = function () {
            return this._g;
        };
        CozzleColor.prototype.B = function () {
            return this._b;
        };

        CozzleColor.prototype.validate = function (color) {
            return (color && color > 0) ? (color > 255 ? 255 : color) : 0;
        };

        CozzleColor.prototype.toString = function () {
            return "rgb(" + this._r + "," + this._g + "," + this._b + ")";
        };

        CozzleColor.prototype.key = function () {
            return this.toString();
        };

        CozzleColor.prototype.equals = function (color) {
            return color && color._r === this._r && color._g === this._g && color._b === this._b;
        };

        CozzleColor.FromJson = function (json) {
            return new CozzleColor(json.R, json.G, json.B);
        };
        return CozzleColor;
    })();
    exports.CozzleColor = CozzleColor;

    // ==== Cozzle Triple ===
    /** Triple is combination of two colors and a blend */
    var CozzleTriple = (function () {
        function CozzleTriple(Left, Right, Blend) {
            this.Left = Left;
            this.Right = Right;
            this.Blend = Blend;
            if (!Blend) {
                this.Blend = alg.MeanColorBlender.Instance.Blend(Left, Right);
            }
        }
        CozzleTriple.prototype.IsNonBlendColor = function (color) {
            return this.Left.equals(color) || this.Right.equals(color);
        };

        CozzleTriple.prototype.HasColor = function (color) {
            return this.IsNonBlendColor(color) || this.Blend.equals(color);
        };

        CozzleTriple.prototype.equals = function (triple) {
            return triple && triple.Left.equals(this.Left) && triple.Right.equals(this.Right) && triple.Blend.equals(this.Blend);
        };

        CozzleTriple.FromJson = function (json) {
            return new CozzleTriple(CozzleColor.FromJson(json.Left), CozzleColor.FromJson(json.Right), CozzleColor.FromJson(json.Blend));
        };
        return CozzleTriple;
    })();
    exports.CozzleTriple = CozzleTriple;

    // ==== Cozzle Position ===
    /** Position is a triple with some metadata */
    var CozzlePosition = (function () {
        /** */
        function CozzlePosition(triple, idx, stag, tag) {
            /** a numeric index */
            this.Index = 0;
            this.Triple = triple;
            this.Index = idx || 0;
            this.STag = stag;
            this.Tag = tag || stag;
        }
        return CozzlePosition;
    })();
    exports.CozzlePosition = CozzlePosition;

    // ==== Enum: EPadMode ===
    /** Possible configurations for Control Pad */
    (function (EPadMode) {
        EPadMode[EPadMode["None"] = 0] = "None";

        EPadMode[EPadMode["UniPad3"] = 1] = "UniPad3";
        EPadMode[EPadMode["UniPad4"] = 2] = "UniPad4";
        EPadMode[EPadMode["UniPad5"] = 3] = "UniPad5";
        EPadMode[EPadMode["UniPad6"] = 4] = "UniPad6";

        EPadMode[EPadMode["DuoPad2x2"] = 5] = "DuoPad2x2";
        EPadMode[EPadMode["DuoPad3x3"] = 6] = "DuoPad3x3";
        EPadMode[EPadMode["DuoPad4x4"] = 7] = "DuoPad4x4";

        EPadMode[EPadMode["DuoPad3x2"] = 8] = "DuoPad3x2";
        EPadMode[EPadMode["DuoPad4x3"] = 9] = "DuoPad4x3";
        EPadMode[EPadMode["DuoPad4x2"] = 10] = "DuoPad4x2";
    })(exports.EPadMode || (exports.EPadMode = {}));
    var EPadMode = exports.EPadMode;

    /** Utilities for handling and validating control pads */
    var PadmodeUtils = (function () {
        function PadmodeUtils() {
        }
        /** return true if unipad, false otherwise */
        PadmodeUtils.IsUniPad = function (mode) {
            switch (mode) {
                case 1 /* UniPad3 */:
                case 2 /* UniPad4 */:
                case 3 /* UniPad5 */:
                case 4 /* UniPad6 */:
                    return true;

                case 5 /* DuoPad2x2 */:
                case 6 /* DuoPad3x3 */:
                case 7 /* DuoPad4x4 */:
                case 8 /* DuoPad3x2 */:
                case 9 /* DuoPad4x3 */:
                case 10 /* DuoPad4x2 */:
                case 0 /* None */:
                    return false;

                default:
                    throw new Error("Unexpected Pad Mode " + EPadMode[mode]);
            }
        };

        /** get the length for the left or right pad */
        PadmodeUtils.GetPadLength = function (mode, isLeftPad) {
            if (typeof isLeftPad === "undefined") { isLeftPad = true; }
            switch (mode) {
                case 1 /* UniPad3 */:
                    return 3;
                case 2 /* UniPad4 */:
                    return 4;
                case 3 /* UniPad5 */:
                    return 5;
                case 4 /* UniPad6 */:
                    return 6;
                case 5 /* DuoPad2x2 */:
                    return 2;
                case 6 /* DuoPad3x3 */:
                    return 3;
                case 7 /* DuoPad4x4 */:
                    return 4;
                case 8 /* DuoPad3x2 */:
                    return isLeftPad ? 3 : 2;
                case 9 /* DuoPad4x3 */:
                    return isLeftPad ? 4 : 3;
                case 10 /* DuoPad4x2 */:
                    return isLeftPad ? 4 : 2;
                case 0 /* None */:
                    return 0;
                default:
                    throw new Error("Unexpected Pad Mode " + EPadMode[mode]);
            }
        };

        /** get the length for the right pad */
        PadmodeUtils.GetRightPadLength = function (mode) {
            return PadmodeUtils.GetPadLength(mode, false);
        };

        /** Verify that pad colors (which contains all colors in all pads) is of expected length */
        PadmodeUtils.VerifyPadLength = function (mode, padColors) {
            if (!padColors)
                return false;

            switch (mode) {
                case 1 /* UniPad3 */:
                    return padColors.length === 3;

                case 2 /* UniPad4 */:
                case 5 /* DuoPad2x2 */:
                    return padColors.length === 4;

                case 3 /* UniPad5 */:
                case 8 /* DuoPad3x2 */:
                    return padColors.length === 5;

                case 4 /* UniPad6 */:
                case 6 /* DuoPad3x3 */:
                case 10 /* DuoPad4x2 */:
                    return padColors.length === 6;

                case 9 /* DuoPad4x3 */:
                    return padColors.length === 7;

                case 7 /* DuoPad4x4 */:
                    return padColors.length === 8;

                case 0 /* None */:
                    return padColors.length === 0;

                default:
                    return false;
            }
        };

        /** Get Colors for either the left pad or right pad based on mode.
        Only returns values for DuoPad* modes */
        PadmodeUtils.GetPadColors = function (mode, padColors, leftPad) {
            if (typeof leftPad === "undefined") { leftPad = true; }
            var start = -1, count = -1;

            switch (mode) {
                case 5 /* DuoPad2x2 */:
                    start = leftPad ? 0 : 2;
                    count = 2;
                    break;

                case 6 /* DuoPad3x3 */:
                    start = leftPad ? 0 : 3;
                    count = 3;
                    break;

                case 7 /* DuoPad4x4 */:
                    start = leftPad ? 0 : 4;
                    count = 4;
                    break;

                case 8 /* DuoPad3x2 */:
                    start = leftPad ? 0 : 3;
                    count = leftPad ? 3 : 2;
                    break;

                case 9 /* DuoPad4x3 */:
                    start = leftPad ? 0 : 4;
                    count = leftPad ? 4 : 3;
                    break;

                case 10 /* DuoPad4x2 */:
                    start = leftPad ? 0 : 4;
                    count = leftPad ? 4 : 2;
                    break;

                case 0 /* None */:
                case 1 /* UniPad3 */:
                case 2 /* UniPad4 */:
                case 3 /* UniPad5 */:
                case 4 /* UniPad6 */:
                    break;

                default:
                    throw new Error("Unexpected Pad Mode " + EPadMode[mode]);
            }

            return (start < 0 || count < 0) ? null : padColors.slice(start, start + count);
        };
        return PadmodeUtils;
    })();
    exports.PadmodeUtils = PadmodeUtils;

    // ==== Cozzle Game ===
    /**
    * Encapsulate the configuration and state for an instance of a game.
    * This base class contains most common configuration and state properties.
    * Individual Blend Games may override this to add their own properties.
    */
    var CozzleGame = (function () {
        function CozzleGame() {
            // configuration properties
            /** Game mode for the configuration of the positions and pads */
            this.Mode = 7 /* DuoPad4x4 */;
            // state properties
            /** For Tracking number of guesses made by user */
            this.NumberOfGuesses = 0;
            /** For Tracking number of mistakes made by user */
            this.NumberOfMistakes = 0;
        }
        return CozzleGame;
    })();
    exports.CozzleGame = CozzleGame;
});
//# sourceMappingURL=model.js.map
