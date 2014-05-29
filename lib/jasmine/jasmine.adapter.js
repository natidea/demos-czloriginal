// Adapter to convert Jasmine to AMD module. Simply alias this module
'use strict';
require.config({
    shim: {
        "lib/jasmine/jasmine": {
            exports: 'jasmine'
        },
        // provide shim for jasmine-html so that dependencies are specified
        "lib/jasmine/jasmine-html": {
            deps: ['lib/jasmine/jasmine'],
            exports: 'jasmine'
        }
    }
});

define([
    'lib/jasmine/jasmine',
    'lib/jasmine/jasmine-html'
], function (jasmine) {
    return jasmine;
});
//# sourceMappingURL=jasmine.adapter.js.map
