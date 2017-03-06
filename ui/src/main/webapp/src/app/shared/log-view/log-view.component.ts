import {Component, ChangeDetectionStrategy, Input} from "@angular/core";

@Component({
    templateUrl: './log-view.component.html',
    styleUrls: ['./log-view.component.scss'],
    selector: 'wu-log-view',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogViewComponent {
    private _text: string;
    private _lines: string[];

    constructor() {

    }

    @Input()
    public set text(text: string) {
        if (!text) {
            text = '';
        }

        this._text = text;
        this._lines = text.split(/\r?\n/g);
    }

    public get lines(): string[] {
        return this._lines;
    }
}
