import {Http} from "@angular/http";
import {HintReducedDTO, StringCache} from "windup-services";

export class TypeReferenceStatisticsService {
    getPackageUseFrequencies(stringCache:StringCache, hints:HintReducedDTO[], nameDepth:number, http:Http):Map<string, number> {
        if (hints == null || hints.length == 0) {
            return new Map<string, number>();
        }

        let allWithJavaTypes = hints
            .filter(hint => hint.javaFQCN != 0);  // Remove any without FQCNs;

        let result = new Map<string, number>();
        allWithJavaTypes.forEach(javaTypeReference => {
            // 2. Organize them by package name and summarize results.
            let val = 1;

            let pattern:string = stringCache.byID[javaTypeReference.javaFQCN];
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