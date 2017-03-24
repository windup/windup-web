import {RouteLinkProviderService} from "../../core/routing/route-link-provider-service";
import {FilterApplication, WindupExecution} from "windup-services";
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
    protected report: string;

    constructor(label: string, icon: string, project: MigrationProject, execution: WindupExecution, report: string) {
        super(label, icon);
        this.project = project;
        this.execution = execution;
        this.report = report;
    }

    protected getExecutionLink(): any[] {
        return ['/projects', this.project.id, 'reports', this.execution.id];
    }

    get link(): string {
        return this.getExecutionLink().concat([this.report]).join('/');
    }


    /**
     * Workaround for issue: https://github.com/Microsoft/TypeScript/issues/4465
     *
     * TypeScript doesn't allow to call parent properties from child classes for ES5
     * For ES6 there should be some support, I'm not sure how reliable though
     */
    protected getIsEnabled() {
        if (!this.project || !this.project.id || !this.execution || !this.execution.id)
            return false;

        return this.execution.state === "COMPLETED";
    }

    get isEnabled(): boolean {
        return this.getIsEnabled();
    }
}

export class ApplicationReportMenuItem extends ReportMenuItem {
    protected application: FilterApplication;

    constructor(
        label: string,
        icon: string,
        project: MigrationProject,
        execution: WindupExecution,
        application: any,
        report: string
    ) {
        super(label, icon, project, execution, report);
        this.application = application;
    }

    get link(): string {
        return this.getExecutionLink().concat(['applications', this.application.id, this.report]).join('/');
    }

    get isEnabled(): boolean {
        if (!super.getIsEnabled() || !this.application || !this.application.id)
            return false;

        return this.execution.state === "COMPLETED";
    }
}
