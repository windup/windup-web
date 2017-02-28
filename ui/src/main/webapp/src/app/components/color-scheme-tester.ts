import {Component} from "@angular/core";
import {ColorBrewColorScheme} from "./reports/color-schemes";


@Component({
    templateUrl: './color-scheme-tester.html'
})
export class ColorSchemeTesterComponent {
    public colorsSchemes: string[] = [];
    public selectedColorScheme: string = this.colorsSchemes[0];
    public selectedNumberOfColors: number = 3;

    public graphData = [];

    public colorSchemeValues = { domain: [] };

    public constructor() {
        this.colorsSchemes = Object.keys(ColorBrewColorScheme);
        this.selectedColorScheme = this.colorsSchemes[0];
        this.selectedNumberOfColors = 3;

        this.redrawGraph();
    }

    public redrawGraph() {
        let data = [];

        for (let i = 0; i < this.selectedNumberOfColors; i++) {
            data.push({
                name: `Item ${i}`,
                value: Math.round(100 / this.selectedNumberOfColors)
            });
        }

        this.graphData = data;

        let countOfColors = this.getAvailableColors(this.selectedColorScheme)
            .reduce((prev, curr) => Math.max(prev, parseInt(curr)), 0);

        if (countOfColors < this.selectedNumberOfColors) {
            this.selectedNumberOfColors = Math.max(0, countOfColors - 1);
        }

        console.log("Selected colors");
        console.log(ColorBrewColorScheme[this.selectedColorScheme][this.selectedNumberOfColors]);

        this.colorSchemeValues = {
            domain: ColorBrewColorScheme[this.selectedColorScheme][this.selectedNumberOfColors]
        };
    }

    public getAvailableColors(scheme: string): string[] {
        if (!scheme || !<any>ColorBrewColorScheme.hasOwnProperty(scheme)) {
            return [];
        }

        return Object.keys(ColorBrewColorScheme[scheme]).sort((a: string, b: string) => parseInt(a) - parseInt(b));
    }
}
