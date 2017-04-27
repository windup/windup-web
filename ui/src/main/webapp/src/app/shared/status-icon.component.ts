import {Component, Input, ChangeDetectionStrategy} from "@angular/core";

@Component({
    selector: 'wu-status-icon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `<span class="status-icon"><span aria-hidden="true" [class]="getIconClass()"></span></span>`,
    styles: [`
        .status-icon {
              margin-right: 6px;
              width: 13px;
              text-align: center;
        }
    `]
})
export class StatusIconComponent {
    @Input()
    status;

    getIconClass(): string {
        switch (this.status) {
            default:
            case 'QUEUED':
                return 'fa fa-clock-o';
            case 'STARTED':
                return 'spinner spinner-xs spinner-inline';
            case 'COMPLETED':
                return 'fa fa-check text-success';
            case 'FAILED':
                return 'fa fa-ban text-danger';
            case 'CANCELLED':
                return 'fa fa-ban text-muted';
        }
    }
}
