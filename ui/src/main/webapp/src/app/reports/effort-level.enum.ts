import {Pipe, PipeTransform} from "@angular/core";


@Pipe({name: 'effortLevelConvert'})
export class EffortLevelPipe implements PipeTransform {
  constructor() {}

  transform(effortNumber: number): string {
    return EffortLevel[effortNumber];
  }
}


export enum EffortLevel {
    Info = 0,
    Trivial = 1,
    Complex = 3,
    Redesign = 5,
    Architectural = 7,
    Unknown = 13
}