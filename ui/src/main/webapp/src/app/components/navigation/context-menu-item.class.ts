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
