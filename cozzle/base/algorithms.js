define(["require", "exports", "cozzle/base/model"], function(require, exports, cm) {
    

    /** Mean algorithm for blending colors */
    var MeanColorBlender = (function () {
        function MeanColorBlender() {
        }
        MeanColorBlender.prototype.Blend = function (color1, color2) {
            return new cm.CozzleColor(MeanColorBlender.average(color1.R(), color2.R()), MeanColorBlender.average(color1.G(), color2.G()), MeanColorBlender.average(color1.B(), color2.B()));
        };

        MeanColorBlender.prototype.Unblend = function (color1, blend) {
            var color = null, R = MeanColorBlender.unAverage(color1.R(), blend.R()), G = MeanColorBlender.unAverage(color1.G(), blend.G()), B = MeanColorBlender.unAverage(color1.B(), blend.B());

            if (R !== undefined && G !== undefined && B !== undefined) {
                // all unblends are successful; create new color
                color = new cm.CozzleColor(R, G, B);
            }

            return color;
        };

        MeanColorBlender.average = function (c1, c2) {
            return Math.floor((c1 + c2) / 2);
        };

        /** given a color and an average, find corresponding color */
        MeanColorBlender.unAverage = function (c1, mean) {
            var result = (mean - c1) + mean;

            return (result < 0 || result > 255) ? undefined : result;
        };
        MeanColorBlender.Instance = new MeanColorBlender();
        return MeanColorBlender;
    })();
    exports.MeanColorBlender = MeanColorBlender;
});
//# sourceMappingURL=algorithms.js.map
