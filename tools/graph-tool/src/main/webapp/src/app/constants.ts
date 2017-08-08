if (process.env.ENV === 'test') {
    // just for tests, mock backend will be used anyway,
    window['windupConstants'] = {
        'SERVER': 'http://localhost:8080',
        'GRAPH_REST_BASE': '',
        'REST_BASE': ''
    };
}

export class Constants {
    public static SERVER: string = window['windupConstants']['SERVER'];
    public static REST_SERVER: string = window['windupConstants']['REST_SERVER'];
    public static SSO_MODE: string = window['windupConstants']['SSO_MODE'];
    public static SERVER_BASE: string = '/';
    public static REST_BASE: string = window['windupConstants']['REST_BASE'];
    public static GRAPH_REST_BASE: string = window['windupConstants']['GRAPH_REST_BASE'];
    public static STATIC_REPORTS_BASE: string = window['windupConstants']['STATIC_REPORTS_BASE'];
    public static UNAUTHENTICATED_PAGE: string = `${Constants.SERVER}/login`;
    public static AUTH_REDIRECT_URL: string = Constants.SERVER;
    public static WINDUP_WEB_VERSION: string = window['windupWebVersion'];
    public static WINDUP_WEB_SCM_REVISION: string = window['windupWebScmRevision'];
    // Core version is obtained through the REST /windup/coreVersion endpoint
}
