var applicationPath = "cozzle/apps/original/app";

var AppConfig;
(function (appConfig) {
    require.config({
        baseUrl: appConfig.RelBaseUrl || '../'
    });

    // get the lib paths configuration
    require(["lib/config.paths"], function (configPaths) {
        require.config({ paths: configPaths.Paths });

        // import and launch application
        require([applicationPath], function (App) {
            // launch
            App.LaunchApp();
        });
    });
})(AppConfig || {});
//# sourceMappingURL=main.js.map
