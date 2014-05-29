define(["require", "exports", "jasmine"], function(require, exports, jasmine) {
    require([
        "spec/cozzle/libtests/postal.spec"
    ], function () {
        // With all tests loaded. Setup jasmine environment.
        var jasmineEnv = jasmine.getEnv();
        jasmineEnv.updateInterval = 1000;

        var htmlReporter = new jasmine.HtmlReporter();

        jasmineEnv.addReporter(htmlReporter);

        jasmineEnv.specFilter = function (spec) {
            return htmlReporter.specFilter(spec);
        };

        // and run jasmine
        jasmineEnv.execute();
    });
});
//# sourceMappingURL=all.spec.js.map
