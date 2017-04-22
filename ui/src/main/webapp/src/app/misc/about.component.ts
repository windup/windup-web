import {Component, OnInit, AfterViewInit} from "@angular/core";

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

    ngOnInit():any {
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
