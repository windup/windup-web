import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

@Component({
    templateUrl: './log-view.component.html',
    styleUrls: ['./log-view.component.scss'],
    selector: 'wu-log-view',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogViewComponent {
    private _text: string;

    @Input()
    lines: string[] = [ "Loading..." ];

    constructor() {

    }

    @Input()
    public set text(text: string) {
        if (!text) {
            text = '';
        }

        this._text = text;
        this.lines = text.split(/\r?\n/g);
    }
}
