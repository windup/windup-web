if (process.env.ENV === 'test') {
    window['windupConstants'] = {
        'SERVER': 'http://localhost:8080' // just for tests, mock backend will be used anyway
    };
}

export class Constants {
    public static SERVER: string = window['windupConstants']['SERVER'];
    public static REST_SERVER: string = window['windupConstants']['SERVER'];
    public static SSO_MODE: string = window['windupConstants']['SSO_MODE'];
    public static SERVER_BASE: string = '/';
    public static REST_BASE: string = Constants.REST_SERVER + "/windup-web-services/rest";
    public static REST_FURNACE: string = Constants.REST_SERVER + "/windup-web-services/rest-furnace";
    public static GRAPH_REST_BASE: string = Constants.REST_SERVER + "/windup-web-services/rest-furnace";
    public static STATIC_REPORTS_BASE:string = "/windup-web-services/staticReport";
    public static UNAUTHENTICATED_PAGE:string = "/windup-web/login";
    public static AUTH_REDIRECT_URL: string = Constants.SERVER + '/windup-web/';
}
