import {
    Component
} from "@angular/core";
import { TreeModel, Ng2TreeSettings, NodeMenuItemAction } from "ng2-tree";

@Component({
    selector: 'wu-dual-list-selector',
    templateUrl: './dual-list-selector.component.html',
    styleUrls: ['./dual-list-selector.component.scss']
})
export class DualListSelectorComponent {

    public settings: Ng2TreeSettings = {
        rootIsVisible: false,
        showCheckboxes: true
    };

    public fonts: TreeModel = {
        value: 'Fonts',
        settings: {
            isCollapsedOnInit: true
        },
        children: [
            {
                value: 'Serif  -  All my children and I are STATIC ¯\\_(ツ)_/¯',
                id: 1,
                settings: {
                    static: true
                },
                children: [
                    { value: '<a href="#" id="antiqua" class="test">Antiqua</a> with HTML tags.', id: 2 },
                    { value: 'Times New Roman', id: 6 },
                    {
                        value: 'Slab serif',
                        id: 7,
                        children: [{ value: 'Candida', id: 8 }, { value: 'Swift', id: 9 }, { value: 'Guardian Egyptian', id: 10 }]
                    }
                ]
            },
            {
                value: 'Sans-serif (Right click me - I have a custom menu)',
                id: 11,
                settings: {
                    menuItems: [
                        { action: NodeMenuItemAction.Custom, name: 'Foo', cssClass: 'fa fa-arrow-right' },
                        { action: NodeMenuItemAction.Custom, name: 'Bar', cssClass: 'fa fa-arrow-right' },
                        { action: NodeMenuItemAction.Custom, name: 'Baz', cssClass: 'fa fa-arrow-right' }
                    ]
                },
                children: [
                    { value: 'Arial', id: 12 },
                    { value: 'Century Gothic', id: 13 },
                    { value: 'DejaVu Sans', id: 14 },
                    { value: 'Futura', id: 15 },
                    { value: 'Geneva', id: 16 },
                    { value: 'Liberation Sans', id: 17 }
                ]
            },
            {
                value: 'Monospace - With ASYNC CHILDREN',
                id: 18,
                // children property is ignored if "loadChildren" is present
                children: [{ value: 'I am the font that will be ignored' }],
                loadChildren: callback => {
                    setTimeout(() => {
                        callback([
                            { value: 'Input Mono', id: 19 },
                            { value: 'Roboto Mono', id: 20 }
                        ]);
                    }, 5000);
                }
            }
        ]
    };

    public constructor() {

    }




}

export interface TreeData {
    id: number,
    name: string,
    childs: TreeData[],
    data: any,
    opened: boolean
}
