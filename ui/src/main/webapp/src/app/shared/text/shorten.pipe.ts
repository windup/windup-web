import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'wuShortenPipe'
})
export class ShortenPipe implements PipeTransform {
    transform(str: string, maxLength: number, restSymbol: string = ', …'): string {
        if (str.length <= maxLength) {
            return str;
        }

        return str.substr(0, maxLength) + restSymbol;
    }
}
