import {ApplicationGroup, WindupExecution} from "windup-services";
import {RegisteredApplication} from "windup-services";

export abstract class WindupEvent {
    public static TYPE = 'WindupEvent';

    protected _type: string;
    protected _source: any;

    constructor(type: string, source: any) {
        this._type = type;
        this._source = source;
    }

    public get type(): string {
        return this._type;
    }

    public get source(): any {
        return this._source;
    }

    public isTypeOf(type: any): boolean {
        return this instanceof type; // this.type === type;
    }
}

export class ApplicationGroupEvent extends WindupEvent {
    public static TYPE = 'ApplicationGroupEvent';
    protected _group: ApplicationGroup;


    constructor(group: ApplicationGroup, source: any) {
        super(ApplicationGroupEvent.TYPE, source);
        this._group = group;
    }

    public get group() {
        return this._group;
    }
}

export class UpdateApplicationGroupEvent extends ApplicationGroupEvent {
    constructor(group: ApplicationGroup, source: any) {
        super(group, source);
    }
}

export class ExecutionEvent extends ApplicationGroupEvent {
    public static TYPE = 'ExecutionEvent';
    private _execution: WindupExecution;

    constructor(execution: WindupExecution, group: ApplicationGroup, source: any) {
        super(group, source);
        this._execution = execution;
    }

    public get group(): ApplicationGroup {
        return this._group;
    }

    get execution(): WindupExecution {
        return this._execution;
    }

    public get type(): string {
        return ExecutionEvent.TYPE;
    }
}

export class NewExecutionStartedEvent extends ExecutionEvent {
    public static TYPE = 'NewExecutionStartedEvent';

    public get type(): string {
        return NewExecutionStartedEvent.TYPE;
    }
}

export class ExecutionUpdatedEvent extends ExecutionEvent {
    public static TYPE = 'ExecutionUpdatedEvent';

    public get type(): string {
        return ExecutionUpdatedEvent.TYPE;
    }
}

export class ExecutionCompletedEvent extends ExecutionUpdatedEvent {
    public static TYPE = 'ExecutionCompletedEvent';

    public get type(): string {
        return ExecutionCompletedEvent.TYPE;
    }
}

export class ApplicationRegistrationEvent extends ApplicationGroupEvent {
    public static TYPE = 'ApplicationRegistrationEvent';
    private _applications: RegisteredApplication[];

    constructor(group: ApplicationGroup, application: RegisteredApplication|RegisteredApplication[], source: any) {
        super(group, source);

        if (!application.hasOwnProperty('length')) {
            this._applications = [ <RegisteredApplication>application ];
        } else {
            this._applications = <RegisteredApplication[]>application;
        }
    }

    public get applications(): RegisteredApplication[] {
        return this._applications;
    }

    public get type(): string {
        return ApplicationRegistrationEvent.TYPE;
    }
}

export class ApplicationRegisteredEvent extends ApplicationRegistrationEvent {

}

export class ApplicationDeletedEvent extends ApplicationRegistrationEvent {

}
