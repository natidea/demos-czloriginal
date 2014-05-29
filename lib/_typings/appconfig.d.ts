
/**
 * Type information for global application configuration object
 */
interface IAppConfig {

    /**
     * Base Url for Require JS
     */
    RelBaseUrl: string;

    /**
     * Optional function to use to start the application
     */
    StartApp: () => void;

    /**
     * If StartApp is not specified, use start path may refer to import path to
     * class with static 'run()' function
     */
    StartPath: string;
}

// ambient declaration for AppConfig

declare var AppConfig: IAppConfig;

// AppConfig = {
//     RelBaseUrl: string,
//     StartApp: function,
//     StartPath: string
// }
