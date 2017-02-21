import {Pipe, PipeTransform} from "@angular/core";
import {HumanizeDuration, HumanizeDurationLanguage} from "humanize-duration-ts";

@Pipe({
    name: 'wuDuration'
})
export class DurationPipe implements PipeTransform {
    private humanizer: HumanizeDuration;
    private language: HumanizeDurationLanguage;

    constructor() {
        this.language = new HumanizeDurationLanguage();
        this.humanizer = new HumanizeDuration(this.language);
    }

    transform(duration: number, options?: any): string {
        if (!options) {
            options = {
                units: ['h', 'm', 's'],
                round: true
            };
        }

        return this.humanizer.humanize(duration, options);
    }
}
