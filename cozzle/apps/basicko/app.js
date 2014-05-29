define(["require", "exports", "jquery", "knockout", "d3", "cozzle/samples/randomdata"], function(require, exports, $, ko, d3, rdata) {
    

    var BasicKoApp = (function () {
        function BasicKoApp() {
        }
        BasicKoApp.LaunchApp = function () {
            (this.appInstance = new BasicKoApp()).Start();
        };

        BasicKoApp.prototype.Start = function () {
            $(function () {
                //$("#content").text("Hello World");
                ko.bindingHandlers["customText"] = new CustomTextHandler();
                ko.bindingHandlers["colorGrid"] = new ColorGridHandler();

                ko.applyBindings(new BasicKoViewModel("Basic Game Example"));
                //this.InstallD3Graph();
            });
        };

        BasicKoApp.prototype.InstallD3Graph = function () {
            var data = ["lightgreen", "steelblue", "lightblue", "orange"];
            var grid = d3.select("#gameBody").append("svg").attr("width", 300).attr("height", 300).attr("class", "chart");

            var group = grid.selectAll("g").data(data).enter().append("g").attr("transform", function (d, i) {
                return "translate(" + (i % 5) * 60 + ",0)";
            });

            group.append("rect").attr("width", 60).attr("height", 60).attr("fill", String); // equiv to => function(d){ return d; }
        };
        return BasicKoApp;
    })();

    var BasicKoViewModel = (function () {
        function BasicKoViewModel(name) {
            this.GameName = ko.observable(name);
            this.GridColors = ko.observableArray();
            this.ChangeGridColors();
        }
        BasicKoViewModel.prototype.ChangeGridColors = function () {
            var count = Math.floor(Math.random() * 25) + 1;
            console.info(count);

            var colors = rdata.ModelData.RandomColorList(count);
            this.GridColors(colors);
        };
        return BasicKoViewModel;
    })();

    var CustomTextHandler = (function () {
        function CustomTextHandler() {
        }
        //init(
        //    element: any,
        //    valueAccessor: () => any,
        //    allBindingsAccessor: () => any,
        //    viewModel: any,
        //    bindingContext: KnockoutBindingContext): void
        //{ }
        CustomTextHandler.prototype.init = function () {
            this.message = "I am overriding you: ";
        };

        CustomTextHandler.prototype.update = function (element, valueAccessor) {
            var name = valueAccessor();
            $(element).text(this.message + name());
        };
        return CustomTextHandler;
    })();

    var ColorGridHandler = (function () {
        function ColorGridHandler() {
        }
        ColorGridHandler.prototype.init = function (element) {
            this.grid = d3.select(element).append("svg").attr("width", 300).attr("height", 300).attr("class", "chart");
        };

        ColorGridHandler.prototype.update = function (element, valueAccessor) {
            var colors = valueAccessor();

            var group = this.grid.selectAll("g").data(colors());

            // update
            group.select("rect").attr("fill", String); // equiv to => function(d){ return d; }, calls toString of CozzleColor

            // enter
            group.enter().append("g").attr("transform", function (d, i) {
                return "translate(" + (i % 5) * 60 + "," + Math.floor(i / 5) * 60 + ")";
            }).append("rect").attr("width", 60).attr("height", 60).attr("fill", String); // equiv to => function(d){ return d; }

            // exit
            group.exit().remove();
        };
        return ColorGridHandler;
    })();
    return BasicKoApp;
});
//# sourceMappingURL=app.js.map
