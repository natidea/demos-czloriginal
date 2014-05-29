define(["require", "exports", "cozzle/base/model"], function(require, exports, cm) {
    var ModelData = (function () {
        function ModelData() {
        }
        // random generators
        ModelData.RandomInt = function (max) {
            if (typeof max === "undefined") { max = 256; }
            return Math.floor((Math.random() * max));
        };

        ModelData.RandomString = function () {
            return "StringTag" + ModelData.RandomInt();
        };

        ModelData.RandomColor = function () {
            return new cm.CozzleColor(ModelData.RandomInt(), ModelData.RandomInt(), ModelData.RandomInt());
        };

        ModelData.RandomTriple = function () {
            return new cm.CozzleTriple(ModelData.RandomColor(), ModelData.RandomColor());
        };

        ModelData.RandomColorList = function (count) {
            var list = [];

            for (var i = 0; i < count; i++) {
                list.push(ModelData.RandomColor());
            }

            return list;
        };

        /** Generate a random 4x4 game. If orderly == true, then make positions
        *  predictable (helpful for testing)
        */
        ModelData.Random4x4Game = function (orderly) {
            if (typeof orderly === "undefined") { orderly = false; }
            var game = new cm.CozzleGame();

            // get pad colors
            game.LeftPad = ModelData.RandomColorList(4);
            game.RightPad = ModelData.RandomColorList(4);

            // setup positions by blending left and right pad colors
            game.Positions = [];

            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    var position = new cm.CozzlePosition(new cm.CozzleTriple(game.LeftPad[i], game.RightPad[j]));

                    if (orderly) {
                        game.Positions.push(position);
                    } else {
                        // place randomly in list
                        game.Positions.splice(ModelData.RandomInt(game.Positions.length + 1), 0, position);
                    }
                }
            }

            for (var i = 0; i < game.Positions.length; i++) {
                game.Positions[i].Index = i;
            }

            return game;
        };
        return ModelData;
    })();
    exports.ModelData = ModelData;
});
//# sourceMappingURL=randomdata.js.map
