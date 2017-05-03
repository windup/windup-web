import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'wuReplace'
})
export class ReplacePipe implements PipeTransform {
    transform(str: string, ...args: string[]): string {
        if (!str)
            return str;
        if (args.length < 2)
            return str;
        return str.replace(args[0], args[1]);
    }
}
