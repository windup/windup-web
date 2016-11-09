import {ApplicationGroup} from "windup-services";
import {RouteLinkProviderService} from "../../services/route-link-provider-service";

export interface ContextMenuItemInterface {
    label: string;
    link: string|Function;
    icon: string;
    isEnabled: boolean;
    action?: Function;
    data?: any;
}

export class ContextMenuItem implements ContextMenuItemInterface {
    protected _label: string;
    protected _link: string;
    protected _icon: string;
    protected _isEnabled: boolean;

    constructor(label: string, icon: string, isEnabled?: boolean, link?: string) {
        this._label = label;
        this._link = link;
        this._icon = icon;
        this._isEnabled = isEnabled;
    }

    get label(): string {
        return this._label;
    }

    get link(): string {
        return this._link;
    }

    get icon(): string {
        return this._icon;
    }

    get isEnabled(): boolean {
        return this._isEnabled;
    }
}

export class ReportMenuItem extends ContextMenuItem {
    protected applicationGroup: ApplicationGroup;
    protected component: any;

    constructor(label: string, icon: string, applicationGroup: ApplicationGroup, component,
                protected _routeLinkProviderService: RouteLinkProviderService
    ) {
        super(label, icon);
        this.component = component;
        this.applicationGroup = applicationGroup;
    }

    get link(): string {
        let execution = this.getLastCompletedExecution();

        return this._routeLinkProviderService.getRouteForComponent(this.component, {
            groupId: this.applicationGroup.id,
            executionId: execution.id
        });
    }

    get isEnabled(): boolean {
        let execution = this.getLastCompletedExecution();
        return <boolean>(this.applicationGroup && this.applicationGroup.id && execution && execution.id);
    }

    protected getLastCompletedExecution() {
        let completedExecutions = this.applicationGroup.executions.filter(execution => execution.state === "COMPLETED");

        if (completedExecutions.length > 0) {
            return completedExecutions[completedExecutions.length - 1];
        }

        return null;
    }
}
