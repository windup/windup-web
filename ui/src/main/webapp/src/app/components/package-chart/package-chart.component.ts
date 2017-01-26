import {
    Component, ElementRef, ChangeDetectorRef, NgZone, ChangeDetectionStrategy, OnChanges,
    OnDestroy, AfterViewInit, SimpleChanges, EventEmitter, Output, Input
} from "@angular/core";
import {BaseChartComponent, calculateViewDimensions, ViewDimensions, formatLabel} from "ng2d3";
import {colorHelper} from "ng2d3/release/utils/color-sets";

@Component({
    selector: 'wu-package-chart',
    templateUrl: './package-chart.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PackageChartComponent extends BaseChartComponent implements OnChanges, OnDestroy, AfterViewInit {

    @Input() view;
    @Input() results;
    @Input() margin = [0, 0, 0, 0];
    @Input() scheme;
    @Input() customColors;
    @Input() gradient: boolean;
    @Input() activeEntries: any[] = [];

    @Output() select = new EventEmitter();
    @Output() activate: EventEmitter<any> = new EventEmitter();
    @Output() deactivate: EventEmitter<any> = new EventEmitter();

    data: any;
    dims: ViewDimensions;
    domain: any[];
    outerRadius: number;
    innerRadius: number;
    transform: string;
    colors: Function;
    legendWidth: number;

    constructor(private element: ElementRef, private cd: ChangeDetectorRef, zone: NgZone) {
        super(element, zone, cd);
    }

    color(item) {
        return this.colors(formatLabel(item.name));
    }

    setColors(): void {
        this.colors = colorHelper(this.scheme, 'ordinal', this.domain, this.customColors);
    }

    onClick(data: any, group: any): void {

    }

    protected bindResizeEvents(view: number[]): void {
        super.bindResizeEvents(view);
    }

    getContainerDims(): any {
        let width = 0;
        let height = 0;
        const hostElem = this.chartElement.nativeElement;
        if (hostElem.parentNode != null) {
            //Get the container dimensions
            width = hostElem.parentNode.clientWidth;
            height = hostElem.parentNode.clientHeight;
        }
        return {width, height};
    }

    ngAfterViewInit(): void {
        this.bindResizeEvents(this.view);
    }

    ngOnDestroy(): void {
        this.unbindEvents();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.update();
    }

    getDomain(): any[] {
        return this.results.map(d => d.name);
    }

    update(): void {
        super.update();

        this.zone.run(() => {
            this.dims = calculateViewDimensions({
                width: this.width * 4 / 12.0,
                height: this.height,
                margins: this.margin
            });

            this.domain = this.getDomain();
            this.setColors();

            let xOffset = this.dims.width / 2;
            let yOffset = this.margin[0] + this.dims.height / 2;
            this.legendWidth = this.width - this.dims.width - this.margin[1];

            this.outerRadius = Math.min(this.dims.width, this.dims.height) / 2.5;
            this.innerRadius = this.outerRadius * 0.75;

            this.transform = `translate(${xOffset} , ${yOffset})`;
        });
    }
}
