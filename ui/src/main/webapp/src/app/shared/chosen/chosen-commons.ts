export interface ChosenOptionGroup {
    value: string;
    label: string;
}

export interface InternalChosenOptionGroup extends ChosenOptionGroup {
    index: number;
}

export interface ChosenOption {
    value: string;
    label: string;
    group?: string;
}

export class InternalChosenOption implements ChosenOption {
    value: any;
    label: string;
    group: string;

    selected: boolean = false;
    labelWithMark: string;
    groupIndex: number;
    groupObject: InternalChosenOptionGroup;
    highlighted: boolean = false;
    focus: boolean = false;

    constructor(value: any, label: string, group: string) {
        this.value = value;
        this.label = label;
        this.group = group;
    }
}
