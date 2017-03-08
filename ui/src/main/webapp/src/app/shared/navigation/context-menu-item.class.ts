import {RouteLinkProviderService} from "../../core/routing/route-link-provider-service";
import {WindupExecution} from "windup-services";
import {MigrationProject} from "windup-services";

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
    protected _isEnabled: boolean | Function;
    protected _action?: Function;
    protected _data?: any;

    constructor(label: string, icon: string, isEnabled?: boolean | Function, link?: string, action?:Function, data?: any) {
        this._label = label;
        this._link = link;
        this._icon = icon;
        this._isEnabled = isEnabled;
        this._action = action;
        this._data = data;
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
        if (this._isEnabled instanceof Function)
            return <boolean>this._isEnabled();
        else
            return <boolean>this._isEnabled;
    }

    get action(): Function {
        return this._action;
    }

    get data():any {
        return this._data;
    }
}

export class ReportMenuItem extends ContextMenuItem {
    protected project: MigrationProject;
    protected execution: WindupExecution;
    protected component: any;

    constructor(label: string, icon: string, project: MigrationProject, execution: WindupExecution, component,
                protected _routeLinkProviderService: RouteLinkProviderService
    ) {
        super(label, icon);
        this.component = component;
        this.project = project;
        this.execution = execution;
    }

    get link(): string {
        return this._routeLinkProviderService.getRouteForComponent(this.component, {
            executionId: this.execution.id,
            projectId: this.project.id,
        });
    }

    get isEnabled(): boolean {
        if (!this.project || !this.project.id || !this.execution || !this.execution.id)
            return false;

        return this.execution.state === "COMPLETED";
    }
}
