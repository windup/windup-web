import {InlineHintModel} from "../../generated/tsModels/InlineHintModel";
import {Http} from "@angular/http";
import {GraphJSONToModelService} from "../../services/graph/graph-json-to-model.service";
import {JavaTypeReferenceModel} from "../../generated/tsModels/JavaTypeReferenceModel";
import {forkJoin} from "rxjs/observable/forkJoin";

export class TypeReferenceStatisticsService {
    getPackageUseFrequencies(hints:InlineHintModel[], nameDepth:number, http:Http):Map<string, number> {
        if (hints == null || hints.length == 0) {
            return new Map<string, number>();
        }

        let allJavaTypeReferences = [];

        forkJoin(hints.map(hint => hint.fileLocationReference).filter(locationReference => locationReference != null))  // Convert to location references
            // Remove any null values
            .map(locationReferences => {
                return locationReferences.filter(locationReference => locationReference != null)
            })
            // Convert to JavaTypeReferences
            .map(locationReferences => {
                return locationReferences
                    .map(locationReference =>
                        <JavaTypeReferenceModel>new GraphJSONToModelService().translateType(locationReference, http, JavaTypeReferenceModel))
                    .filter(javaTypeReference => javaTypeReference.resolvedSourceSnippit != null);
            }).subscribe(javaTypeReferences => {
                allJavaTypeReferences = javaTypeReferences;
            });

        let result = new Map<string, number>();
        allJavaTypeReferences.forEach(javaTypeReference => {
            // 2. Organize them by package name and summarize results.
            let val = 1;

            let pattern:string = javaTypeReference.resolvedSourceSnippit;
            let keyArray:string[] = pattern.split(".");

            if (keyArray.length > 1 && nameDepth > 1) {
                let patternSB = "";
                for (let i = 0; i < nameDepth; i++) {
                    let subElement = keyArray[i];
                    if (subElement.indexOf("(") != -1 || subElement.indexOf(")") != -1) {
                        continue;
                    }

                    if (patternSB.length != 0) {
                        patternSB += ".";
                    }
                    patternSB += subElement;
                }
                if (patternSB.indexOf(".") != -1) {
                    patternSB += ".*";
                }
                pattern = patternSB;
            }
            if (pattern.indexOf("(") != -1) {
                pattern = pattern.substring(0, pattern.indexOf('('));
            }

            if (result.has(pattern)) {
                val = result.get(pattern);
                val++;
            }
            result.set(pattern, val);
        });
        return result;
    }
}