import * as React from "react";
import { Package, PackageMetadata } from "models/api";
import { getRegisteredApplicationPackages } from "api/api";

export interface IStateArgs {
  applicationIds: number[];
}

export interface IState {
  packages?: Package[];
  loading: boolean;
  fetchPackages: () => void;
}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const createPromies = (appId: number): Promise<PackageMetadata> => {
  return getRegisteredApplicationPackages(appId).then(({ data }) => {
    if (data.scanStatus !== "COMPLETE") {
      return delay(1000).then(() => {
        return createPromies(appId);
      });
    } else {
      return data;
    }
  });
};

const put = (aPackage: Package) => {
  // if (!this.packagesByNameMap.has(aPackage.fullName)) {
  //   this.registeredPackages[aPackage.id] = aPackage;
  //   this.packagesByNameMap.set(aPackage.fullName, aPackage);
  // }
};

const putHierarchy = (aPackage: Package) => {
  put(aPackage);

  if (aPackage.childs) {
    aPackage.childs.forEach((child) => putHierarchy(child));
  }
};

const mergePackageHierarchy = (
  aPackage: Package,
  packageMap: Map<string, Package>,
  parentPackage: Package | undefined = undefined
) => {
  let packageInMap: Package | undefined = undefined;

  let childPackages = aPackage.childs;

  if (!packageMap.has(aPackage.fullName)) {
    packageInMap = Object.assign({}, aPackage); // clone object
    packageMap.set(aPackage.fullName, packageInMap);

    if (parentPackage) {
      parentPackage.childs.push(packageInMap);
    }

    packageInMap.childs = [];
  } else {
    // some magic
    packageInMap = packageMap.get(aPackage.fullName);
    if (packageInMap) {
      packageInMap.countClasses += aPackage.countClasses;
    }
  }

  childPackages.forEach((childPackage) => {
    mergePackageHierarchy(childPackage, packageMap, packageInMap);
  });

  return packageInMap;
};

const mergePackageRoots = (root: Package[]): Package[] => {
  let packageMap = new Map<string, Package>();
  let packageRoots = new Set<Package>();
  let result: Package[] = [];

  root.forEach((aPackage) => {
    let rootPackage = mergePackageHierarchy(aPackage, packageMap);

    if (!packageRoots.has(rootPackage!)) {
      result.push(rootPackage!);
      packageRoots.add(rootPackage!);
    }
  });

  return result;
};

export const useLoadPackages = ({ applicationIds }: IStateArgs): IState => {
  const [loading, setLoading] = React.useState(false);
  const [packages, setPackages] = React.useState<Package[]>();

  const fetchPackages = React.useCallback(() => {
    setLoading(true);

    Promise.all(applicationIds.map((appId) => createPromies(appId))).then(
      (packageMetadataArray: PackageMetadata[]) => {
        let arrayOfRoots = ([] as any).concat(
          ...packageMetadataArray.map(
            (singlePackageMetadata) => singlePackageMetadata.packageTree
          )
        );
        let mergedRoots = mergePackageRoots(arrayOfRoots);
        mergedRoots.forEach((singleRoot) => putHierarchy(singleRoot));

        const packageTree: Package[] = mergedRoots;
        setPackages(packageTree);
        setLoading(false);
      }
    );
  }, [applicationIds]);

  const carlos = React.useRef(fetchPackages);

  return {
    loading,
    packages,
    fetchPackages: carlos.current,
  };
};
