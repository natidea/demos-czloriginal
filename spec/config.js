// configuration
require.config({
    baseUrl: '../',
    paths: {
        // no shims or defines needed for jquery
        jquery: "lib/jquery/jquery-1.10.2",
        // jasmine adapter contains necessary shims and an amd define.
        // This adapter loads both jasmine and jasmine-html
        jasmine: "lib/jasmine/jasmine.adapter",
        knockout: "lib/knockout/knockout-3.0.0",
        postal: "lib/postal/postal",
        underscore: "lib/underscore/underscore"
    }
});

// start tests:
console.log("starting tests");
require(['spec/all.spec'], function () {
});
//# sourceMappingURL=config.js.map
