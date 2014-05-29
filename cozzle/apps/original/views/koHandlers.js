define(["require", "exports", "jquery", "d3"], function(require, exports, $, d3) {
    var CozzleBoardHandler = (function () {
        function CozzleBoardHandler() {
        }
        /** @override */
        CozzleBoardHandler.prototype.init = function (element) {
            var gridSize = $(element).width();

            var grid = d3.select(element).append("svg").attr("width", gridSize).attr("height", gridSize).attr("class", "boardSvg");

            // save data
            $.data(element, "grid", grid);
            $.data(element, "gridSize", gridSize);
        };

        /** @override */
        CozzleBoardHandler.prototype.update = function (element, valueAccessor) {
            // get data
            var grid = $.data(element, "grid");
            var gridSize = $.data(element, "gridSize");
            var boardState = (valueAccessor())();
            var positions = boardState.Positions;

            // compute data
            var rectSize = (gridSize * 0.92) / 4;
            var offset = (gridSize * 0.08) / 5;

            // bind data
            var group = grid.selectAll("g").data(positions);

            // update
            group.select("rect").call(CozzleBoardHandler.GetFormatRectsAction(boardState.ActivePosition));

            // enter
            group.enter().append("g").attr("transform", function (d, i) {
                var x = offset + ((i % 4) * (rectSize + offset));
                var y = offset + (Math.floor(i / 4) * (rectSize + offset));

                return "translate(" + x + "," + y + ")";
            }).append("rect").attr("width", rectSize).attr("height", rectSize).call(CozzleBoardHandler.GetFormatRectsAction(boardState.ActivePosition));

            // exit
            group.exit().remove();
        };

        CozzleBoardHandler.GetFormatRectsAction = function (activePosition) {
            return function (rects) {
                rects.attr("fill", CozzleBoardHandler.GetRectColorAction(activePosition)).attr("stroke", CozzleBoardHandler.GetPositionBlendColor).attr("class", function (d, i) {
                    return activePosition === i ? "selectedRect" : "unselectedRect";
                });
                return rects;
            };
        };

        CozzleBoardHandler.GetRectColorAction = function (activePosition) {
            return function (pos, i) {
                return (i < activePosition) ? "black" : CozzleBoardHandler.GetPositionBlendColor(pos);
            };
        };

        CozzleBoardHandler.GetPositionBlendColor = function (pos) {
            return pos.Triple.Blend.toString();
        };
        return CozzleBoardHandler;
    })();
    exports.CozzleBoardHandler = CozzleBoardHandler;

    var CozzlePadHandler = (function () {
        function CozzlePadHandler() {
        }
        /** @override */
        CozzlePadHandler.prototype.init = function (element) {
            var gridSize = $(element).width();

            var grid = d3.select(element).append("svg").attr("width", gridSize).attr("height", gridSize * 0.8).attr("class", "padSvg");

            // save data
            $.data(element, "grid", grid);
            $.data(element, "gridSize", gridSize);
        };

        /** @override */
        CozzlePadHandler.prototype.update = function (element, valueAccessor, allBindingsAccessor, viewModel) {
            console.dir(allBindingsAccessor());
            console.dir(viewModel);

            // get data
            var grid = $.data(element, "grid");
            var gridSize = $.data(element, "gridSize");
            var padState = (valueAccessor())();
            var pad = padState.Pad;
            var selectedIndex = padState.SelectedIndex;
            var isLeft = padState.IsLeft;
            var padSize = gridSize * 0.8;
            var selSize = gridSize * 0.2;

            // compute data
            var rectSize = (padSize * 0.92) / 2;
            var offset = (padSize * 0.08) / 3;
            var initialXOffset = isLeft ? 0 : selSize;

            // bind data
            var group = grid.selectAll("g").data(pad);

            // update
            group.select("rect").call(CozzlePadHandler.GetFormatRectsAction(selectedIndex, isLeft));

            // enter
            group.enter().append("g").attr("transform", function (d, i) {
                var x = offset + ((i % 2) * (rectSize + offset)) + initialXOffset;
                var y = offset + (Math.floor(i / 2) * (rectSize + offset));

                return "translate(" + x + "," + y + ")";
            }).append("rect").attr("width", rectSize).attr("height", rectSize).on("click", function (d, i) {
                console.log("clicked", i);
                viewModel.Select(i, isLeft);
            }).call(CozzlePadHandler.GetFormatRectsAction(selectedIndex, isLeft));

            // exit
            group.exit().remove();

            // draw selection info
            var selData = (selectedIndex >= 0 && selectedIndex < pad.length) ? [pad[selectedIndex].toString()] : ["white"];

            var selRects = grid.selectAll(".selRect").data(selData);

            selRects.select("rect").attr("fill", String);

            selRects.enter().append("g").attr("class", "selRect").attr("transform", function () {
                var x = isLeft ? padSize : 0;
                var y = 0;

                return "translate(" + x + "," + y + ")";
            }).append("rect").attr("width", selSize).attr("height", padSize).attr("fill", String);
        };

        CozzlePadHandler.GetFormatRectsAction = function (selectedIndex, isLeft) {
            console.log(selectedIndex, isLeft);
            return function (rects) {
                rects.attr("fill", String);

                rects.attr("stroke", String).attr("stroke-width", 0).attr("class", function (d, i) {
                    return selectedIndex === i ? "selectedRect" : "unselectedRect";
                });

                return rects;
            };
        };
        return CozzlePadHandler;
    })();
    exports.CozzlePadHandler = CozzlePadHandler;
});
//# sourceMappingURL=koHandlers.js.map
