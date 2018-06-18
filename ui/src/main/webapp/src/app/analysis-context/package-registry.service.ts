import {Injectable} from "@angular/core";
import {Package} from "../generated/windup-services";

@Injectable()
export class PackageRegistryService {
    protected registeredPackages: {[id: number]: Package} = {};
    protected packagesByNameMap: Map<string, Package> = new Map<string, Package>();

    public get(id: number): Package {
        return this.registeredPackages[id];
    }

    public exists(id: number): boolean {
        return this.registeredPackages.hasOwnProperty(id);
    }

    public put(aPackage: Package) {
        if (!this.packagesByNameMap.has(aPackage.fullName)) {
            this.registeredPackages[aPackage.id] = aPackage;
            this.packagesByNameMap.set(aPackage.fullName, aPackage);
        }
    }

    public putHierarchy(aPackage: Package) {
        this.put(aPackage);

        if (aPackage.children) {
            aPackage.children.forEach(child => this.putHierarchy(child));
        }
    }

    /**
     * Recursively merges multiple package root sets into one
     *
     * +- a   +   +- a   =   +- a
     * +-- b      +-- c      +-- b
     *                       +-- c
     *
     * +- a   +   +- b   =   +- a
     *                       +- b
     *
     */
    public mergePackageRoots(root: Package[]): Package[] {
        let packageMap = new Map<string, Package>();
        let packageRoots = new Set<Package>();
        let result = [];

        root.forEach(aPackage => {
            let rootPackage = this.mergePackageHierarchy(aPackage, packageMap);

            if (!packageRoots.has(rootPackage)) {
                result.push(rootPackage);
                packageRoots.add(rootPackage);
            }
        });

        return result;
    }

    protected mergePackageHierarchy(aPackage: Package, packageMap: Map<string, Package>, parentPackage: Package = null) {
        let packageInMap: Package = null;

        let childPackages = aPackage.children;

        if (!packageMap.has(aPackage.fullName)) {
            packageInMap = Object.assign({}, aPackage); // clone object
            packageMap.set(aPackage.fullName, packageInMap);

            if (parentPackage) {
                parentPackage.children.push(packageInMap);
            }

            packageInMap.children = [];
        } else {
            // some magic
            packageInMap = packageMap.get(aPackage.fullName);
            packageInMap.countClasses += aPackage.countClasses;
        }

        childPackages.forEach(childPackage => {
            this.mergePackageHierarchy(childPackage, packageMap, packageInMap)
        });

        return packageInMap;
    }
}
