import {
    Component, Input, ViewChild
} from "@angular/core";
import { Package } from "../../generated/windup-services";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlattener, MatTreeFlatDataSource } from "@angular/material";

export enum ViewSelector {
    LIST = 'LIST',
    TREE = 'TREE'
}

export class PackageFlatNode implements Package {
    id: number;
    name: string;
    fullName: string;
    countClasses: number;
    childs: Package[];
    level: number;
    known: boolean;

    icon: string;
    expandable: boolean;
    flaternName: string;
}

@Component({
    selector: 'wu-select-packages-summary',
    templateUrl: './select-packages-summary.component.html',
    styleUrls: ['./select-packages-summary.component.scss']
})
export class SelectPackagesSummaryComponent {
    viewSelected: ViewSelector = ViewSelector.LIST;

    _packages: Package[];

    @Input()
    title: string;
    
    @ViewChild('tree')
    tree: any;

    expandTree = () => {
        if (this.tree) {
            this.tree.treeControl.expandAll();
        }
    };
    transformer = (node: Package, level: number) => {
        return {
            expandable: !!node.childs && node.childs.length > 0,
            name: node.name,
            level: level,
        };
    };
    hasChild = (_: number, _nodeData: PackageFlatNode): boolean => _nodeData.expandable;

    treeControl = new FlatTreeControl<PackageFlatNode>(node => node.level, node => node.expandable);
    treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.childs);
    treeDataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    constructor() {
        
    }

    get packages(): Package[] {
        return this._packages;
    }

    @Input()
    set packages(packages: Package[]) {
        this._packages = packages;
        if (packages) {
            packages.sort((a, b) => a.fullName.localeCompare(b.fullName));

            this.createTree();
            this.expandTree();
        }
    }

    private createTree() {
        const tree: Package[] = [];
        for (let i = 0; i < this._packages.length; i++) {
            const node = this._packages[i];
            this.createNodesFromPackageFullName(node.fullName, tree);
        }

        this.flatternTreeModelsOnCascade(tree);
        this.sortTreeModelOnCascade(tree);

        this.treeDataSource.data = tree;
    }

    /**
        * Create nodes on tree using packageFullName
        */
    private createNodesFromPackageFullName(packageFullName: string, packages: Package[]): void {
        const split: string[] = packageFullName.split('.');
        for (let i = 0; i < split.length; i++) {
            const packageName = split[i];

            let node: Package;
            if (packages.length > 0) {
                node = packages.find((p) => packageName == p.name);
            }

            if (!node) {
                node = {
                    name: packageName,
                    childs: []
                } as Package;
                packages.push(node);
            }

            packages = node.childs;
        }
    }

    private flatternTreeModelsOnCascade(packages: Package[]): void {
        for (let i = 0; i < packages.length; i++) {
            let node = packages[i];
            while (node.childs && node.childs.length == 1) {
                const parentName: string = node.name;
                node = node.childs[0];
                node.name = parentName + "." + node.name;
            }
            packages[i] = node;

            if (node.childs && node.childs.length > 1) {
                this.flatternTreeModelsOnCascade(packages[i].childs);
            }
        }
    }

    private sortTreeModelOnCascade(packages: Package[]): void {
        packages.sort(this.treeModelComparator);
        packages.forEach(p => {
            this.sortTreeModelOnCascade(p.childs);
        });
    }

    private treeModelComparator(a: Package, b: Package): number {
        return a.name > b.name ? 1 : -1;
        // if (a.childs && a.childs.length > 0) {
        //     if (b.childs && b.childs.length > 0) {
        //         return a.name > b.name ? 1 : -1;
        //     } else {
        //         return 1;
        //     }
        // } else {
        //     if (b.childs && b.childs.length > 0) {
        //         return -1;
        //     } else {
        //         return a.name > b.name ? 1 : -1;
        //     }
        // }
    }

}
