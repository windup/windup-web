export class Constants {
    public static SERVER: string = 'http://localhost:4040';
    public static SERVER_BASE: string = '/';
    public static REST_BASE:string = "/windup-web-services/rest";
    public static STATIC_REPORTS_BASE:string = "/windup-web-services/staticReport";
    public static UNAUTHENTICATED_PAGE:string = "/not_loggedin.html";
    public static AUTH_REDIRECT_URL: string = Constants.SERVER + '/index.html';
}
