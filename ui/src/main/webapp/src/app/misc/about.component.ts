import {Component, OnInit, AfterViewInit} from "@angular/core";
import {Constants} from "../constants";
import {Http} from "@angular/http";
import {AbstractComponent} from "../shared/AbstractComponent";

@Component({
    templateUrl: './about.component.html',
    styles: [`
        /deep/ img.windupContributor {
            width: 35px;
            margin: 4px;
        }
    `]
})
export class AboutPageComponent extends AbstractComponent implements OnInit, AfterViewInit {

    private WINDUP_CORE_VERSION_URL: string = "/windup/coreVersion";

    versionWindupWeb: string = Constants.WINDUP_WEB_VERSION;
    scmRevisionWindupWeb: string = Constants.WINDUP_WEB_SCM_REVISION;
    versionWindupCore: string = "(loading)";
    scmRevisionWindupCore: string = "(loading)";

    // Externally loaded
    contributors: {login: string, html_url: string; avatar_url: string }[] = [];

    constructor (private _http: Http) {
        super();
    }

    ngOnInit(): any {
        this._http.get(Constants.REST_BASE + this.WINDUP_CORE_VERSION_URL)
            .map(res => res.json())
            .takeUntil(this.destroy)
            .subscribe(versionAndRevision => {
                this.versionWindupCore = versionAndRevision.version;
                this.scmRevisionWindupCore = versionAndRevision.scmRevision;
            });

        /* TODO: This is getting Unauthorized.
        this._http.get("https://api.github.com/repos/windup/windup/contributors")
            .map(res => res.json())
            .subscribe(contributors => this.contributors = contributors);
        */
    }

    ngAfterViewInit(): void {
        let divTarget = $("#windup-contributors");
        $.getJSON( "https://api.github.com/repos/windup/windup/contributors", function( data ) {
            $.each( data, function( key, val ) {
                $( "<a data-toggle='tooltip' title='"+val.login+"' href='"+val.html_url+"'><img class='windupContributor' sr"+"c='"+val.avatar_url+"'/></a>").appendTo(divTarget);
            });
        });

        $('[data-toggle="tooltip"]').tooltip({
            'placement': 'top'
        });
    }
}
