import { Component, Input, Output, EventEmitter } from "@angular/core";
import { PassThrough } from "stream";

export interface Path {
    id: number;
    children?: Path[];
    icon?: string;
    label: string;
    selected: boolean;
}

@Component({
    selector: 'wu-transformation-paths',
    templateUrl: './transformation-paths.component.html',
    styleUrls: ['./transformation-paths.component.scss']
})
export class TransformationPathsComponent {

    @Input()
    paths: Path[];

    @Output()
    onPathChange: EventEmitter<Path[]> = new EventEmitter<Path[]>();

    public constructor() {

    }

    onCardClick(path: Path): void {
        path.selected = !path.selected;
        this.emitPathChangeEvent();
    }

    onCheckboxClick(path: Path): void {
        path.selected = !path.selected;
        this.emitPathChangeEvent();
    }

    onDropdownChange(path: Path, selectedChildPath: number): void {
        path.selected = true;

        const pathChildren: Path[] = path.children;
        if (pathChildren && pathChildren.length > 0) {
            pathChildren.forEach(child => {
                if (child.id == selectedChildPath) {
                    child.selected = true;
                } else {
                    child.selected = false;
                }
            });
        }

        this.emitPathChangeEvent();
    }

    private emitPathChangeEvent(): void {
        let mappedPaths: Path[] = [];

        for (let index = 0; index < this.paths.length; index++) {
            const path = this.paths[index];
            if (path.selected) {
                if (path.children && path.children.length > 0) {
                    mappedPaths = mappedPaths.concat(path.children);
                } else {
                    mappedPaths.push(path);
                }
            }
        }

        const selectedPaths: Path[] = mappedPaths.filter(path => path.selected);
        this.onPathChange.emit(selectedPaths);
    }

}