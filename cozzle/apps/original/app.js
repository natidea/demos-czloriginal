/// <amd-dependency path="knockoutamdhelpers" />
define(["require", "exports", "jquery", "knockout", "./viewModels", "./views/koHandlers", "knockoutamdhelpers"], function(require, exports, $, ko, vm, handlers) {
    

    var CozzleApp = (function () {
        function CozzleApp() {
        }
        CozzleApp.LaunchApp = function () {
            var _this = this;
            $(function () {
                (_this.appInstance = new CozzleApp()).Start();
            });
        };

        CozzleApp.prototype.Start = function () {
            // initialize Knockout
            this.InitializeKO();

            // start a new game
            ko.applyBindings(new vm.GameVM(), $("#content")[0]);
        };

        /** add binding handlers and configure template path */
        CozzleApp.prototype.InitializeKO = function () {
            // template paths
            ko.amdTemplateEngine.defaultPath = "cozzle/apps/original/views/";
            ko.amdTemplateEngine.defaultSuffix = ".tmpl.html";

            ko.bindingHandlers["cozzleBoard"] = new handlers.CozzleBoardHandler();
            ko.bindingHandlers["cozzlePad"] = new handlers.CozzlePadHandler();
        };
        return CozzleApp;
    })();
    return CozzleApp;
});
//# sourceMappingURL=app.js.map
