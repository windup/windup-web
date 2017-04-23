import {Component, OnInit, AfterViewInit} from "@angular/core";
import {Constants} from "../constants";
import {Http} from "@angular/http";

@Component({
    templateUrl: './about.component.html',
    styles: [`
        /deep/ img.windupContributor {
            width: 35px;
            margin: 4px;
        }
    `]
})
export class AboutPageComponent implements OnInit, AfterViewInit {

    private WINDUP_CORE_VERSION_URL: string = "/windup/coreVersion";

    versionWindupWeb: string = Constants.WINDUP_WEB_VERSION;
    versionWindupCore: string = "(loading)";

    constructor (private _http: Http) {
    }

    ngOnInit():any {
        this._http.get(Constants.REST_BASE + this.WINDUP_CORE_VERSION_URL)
            .map(res => res.json())
            .subscribe(version => this.versionWindupCore = version);
    }

    ngAfterViewInit(): void {
        var divTarget = $("#windup-contributors");
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
