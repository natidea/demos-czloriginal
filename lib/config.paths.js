define(["require", "exports"], function(require, exports) {
    /**
    * An object that can be used to configure all the paths in this lib
    */
    exports.Paths = {
        d3: "lib/d3/d3",
        jquery: "lib/jquery/jquery-1.10.2",
        knockout: "lib/knockout/knockout-3.0.0",
        knockoutamdhelpers: "lib/knockout/knockout-amd-helpers",
        postal: "lib/postal/postal",
        underscore: "lib/underscore/underscore",
        text: "lib/requirejs/text",
        // ... for non-AMD libs, we use adapters that contain necessary shims and an AMD define
        // this adapter loads both jasmine and jasmine-html
        jasmine: "lib/jasmine/jasmine.adapter"
    };
});
//# sourceMappingURL=config.paths.js.map
