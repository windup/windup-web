import {Injectable} from "@angular/core";
import {Package} from "windup-services";

@Injectable()
export class PackageRegistryService {
    protected registeredPackages: {[id: number]: Package} = {};

    public get(id: number): Package {
        return this.registeredPackages[id];
    }

    public exists(id: number): boolean {
        return this.registeredPackages.hasOwnProperty(id);
    }

    public put(aPackage: Package) {
        this.registeredPackages[aPackage.id] = aPackage;
    }

    public putHierarchy(aPackage: Package) {
        this.put(aPackage);

        if (aPackage.childs) {
            aPackage.childs.forEach(child => this.putHierarchy(child));
        }
    }
}
