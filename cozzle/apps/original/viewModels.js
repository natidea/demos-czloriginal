define(["require", "exports", "knockout", "cozzle/samples/randomdata"], function(require, exports, ko, rdata) {
    /** Represent game play, scoring and titles etc */
    var GameVM = (function () {
        // --- game construction
        function GameVM() {
            // --- info
            /** game title */
            this.Title = ko.observable();
            /** number of guesses */
            this.Guesses = ko.observable();
            /** number of incorrect guesses */
            this.Incorrect = ko.observable();
            /** formatted game time */
            this.FormattedGameTime = ko.observable();
            this.timerHandler = 0;
            // --- board pieces
            /** "Board" positions containing triples and other metadata */
            this.Positions = ko.observableArray();
            /** Left Control pad */
            this.LeftPad = ko.observableArray();
            /** Right Control pad */
            this.RightPad = ko.observableArray();
            // --- game state
            /** Indicate when game is over */
            this.IsGameOver = ko.observable();
            /** active position */
            this.ActivePosition = ko.observable();
            /** selected color on left pad */
            this.SelectedLeft = ko.observable();
            /** selected color on right pad */
            this.SelectedRight = ko.observable();
            /** preview when two colors are selected */
            this.Preview = ko.observable();
            this.InitializeComputedObservables();
            this.NewGame();
        }
        GameVM.prototype.InitializeComputedObservables = function () {
            var _this = this;
            this.BoardState = ko.computed(function () {
                return {
                    Positions: _this.Positions(),
                    ActivePosition: _this.ActivePosition()
                };
            });

            this.LeftPadState = ko.computed(function () {
                return {
                    Pad: _this.LeftPad(),
                    SelectedIndex: _this.SelectedLeft(),
                    IsLeft: true
                };
            });

            this.RightPadState = ko.computed(function () {
                return {
                    Pad: _this.RightPad(),
                    SelectedIndex: _this.SelectedRight(),
                    IsLeft: false
                };
            });

            this.PreviewColor = ko.computed(function () {
                var preview = _this.Preview();
                return preview ? preview.Blend.toString() : 'transparent';
            });
        };

        GameVM.prototype.NewGame = function (game) {
            var _this = this;
            if (!game) {
                game = rdata.ModelData.Random4x4Game();
            }

            this.Title("COZZLE");
            this.Guesses(0); // tmp
            this.Incorrect(0); // tmp

            this.Positions(game.Positions);
            this.allTriples = game.Positions.map(function (pos) {
                return pos.Triple;
            });

            this.LeftPad(game.LeftPad);
            this.RightPad(game.RightPad);

            this.IsGameOver(false);
            this.ActivePosition(0);
            this.SelectedLeft(-1); // tmp
            this.SelectedRight(-1); // tmp
            this.Preview(null); // tmp this.allTriples[3]

            if (this.timerHandler) {
                clearInterval(this.timerHandler);
            }

            this.FormattedGameTime("0:00");

            var timer = 0;
            this.timerHandler = setInterval(function () {
                timer += 1;
                var minutes = Math.floor(timer / 60);
                var seconds = timer % 60;

                _this.FormattedGameTime(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
            }, 1000);
        };

        // (above is enough for static game)
        // --- game play
        /** Get the selected color from the left pad (when isLeft == true)
        *  or the right pad, or null if nothing is selected
        */
        GameVM.prototype.GetSelection = function (isLeft) {
            if (typeof isLeft === "undefined") { isLeft = true; }
            var idx = isLeft ? this.SelectedLeft() : this.SelectedRight();
            if (idx === -1)
                return null;

            return (isLeft ? this.LeftPad() : this.RightPad())[idx];
        };

        /** clear left and right selections */
        GameVM.prototype.ClearSelections = function () {
            this.SelectedLeft(-1);
            this.SelectedRight(-1);
        };

        /** clear preview and selections if it is set, otherwise noop */
        GameVM.prototype.ClearPreview = function () {
            if (this.Preview()) {
                this.Preview(null);
                this.ClearSelections();
            }
        };

        GameVM.prototype.Select = function (selection, isLeft) {
            if (this.IsGameOver())
                return;

            this.ClearPreview();

            if (isLeft) {
                this.SelectedLeft(selection);
            } else {
                this.SelectedRight(selection);
            }

            if (this.SelectedLeft() !== -1 && this.SelectedRight() !== -1) {
                // ... set preview position that matches both selections
                this.SetPreview();

                // ... check if selections match active position
                this.CheckSelections();
            }
        };

        /** set preview based on left and right selections */
        GameVM.prototype.SetPreview = function () {
            var left = this.GetSelection(true);
            var right = this.GetSelection(false);

            for (var i = 0; i < this.allTriples.length; i++) {
                var t = this.allTriples[i];

                if (t.IsNonBlendColor(left) && t.IsNonBlendColor(right)) {
                    this.Preview(t);
                    break;
                }
            }
        };

        /** determine if the selections are correct */
        GameVM.prototype.CheckSelections = function () {
            // active position
            var position = this.Positions()[this.ActivePosition()];
            var t = position.Triple;

            var left = this.GetSelection(true);
            var right = this.GetSelection(false);

            this.Guesses(this.Guesses() + 1);

            // check if selections match position
            if (t.IsNonBlendColor(left) && t.IsNonBlendColor(right)) {
                // matches!
                this.IncrementActivePosition();

                // determine if game is over
                if (this.ActivePosition() === this.Positions().length) {
                    this.IsGameOver(true);
                    clearInterval(this.timerHandler);
                }
            } else {
                this.Incorrect(this.Incorrect() + 1);
            }
        };

        /** Move to the next position */
        GameVM.prototype.IncrementActivePosition = function () {
            this.ActivePosition(this.ActivePosition() + 1);
        };
        return GameVM;
    })();
    exports.GameVM = GameVM;
});
//# sourceMappingURL=viewModels.js.map
