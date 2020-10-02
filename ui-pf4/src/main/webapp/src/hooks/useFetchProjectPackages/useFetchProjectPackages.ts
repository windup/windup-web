import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import {
  getAnalysisContext,
  getProjectById,
  getRegisteredApplicationPackages,
} from "api/api";
import {
  AnalysisContext,
  MigrationProject,
  Package,
  PackageMetadata,
} from "models/api";

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const createWatchPromises = (appId: number): Promise<PackageMetadata> => {
  return getRegisteredApplicationPackages(appId).then(({ data }) => {
    if (data.scanStatus !== "COMPLETE") {
      return delay(1000).then(() => {
        return createWatchPromises(appId);
      });
    } else {
      return data;
    }
  });
};

const putHierarchy = (aPackage: Package) => {
  // put(aPackage);

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

const disaggregatePackages = (
  packages: Package[],
  applicationPackages: Package[],
  thirdPartyPackages: Package[]
): void => {
  for (let i = 0; i < packages.length; i++) {
    const node = packages[i];

    const newNode1 = Object.assign({}, node, { childs: [] });
    const newNode2 = Object.assign({}, node, { childs: [] });

    if (node.known) {
      // If at least one child is unknown, then the node will be part of both Arrays
      if (node.childs && node.childs.some((p) => p.known === false)) {
        applicationPackages.push(newNode1);
        thirdPartyPackages.push(newNode2);
      } else {
        thirdPartyPackages.push(newNode2);
      }
    } else {
      applicationPackages.push(newNode1);
    }

    if (node.childs) {
      disaggregatePackages(node.childs, newNode1.childs, newNode2.childs);
    }
  }
};

export interface ISelectionState<T> {
  project?: MigrationProject;
  analysisContext?: AnalysisContext;
  packages?: Package[];
  applicationPackages?: Package[];
  thirdPartyPackages?: Package[];
  isFetching: boolean;
  fetchError?: string;
}

export const useFetchProjectPackages = <T>(
  projectId: number | string
): ISelectionState<T> => {
  const [project, setProject] = useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>();

  const [packages, setPackages] = useState<Package[]>();

  const [applicationPackages, setApplicationPackages] = useState<Package[]>([]);
  const [thirdPartyPackages, setThirdPartyPackages] = useState<Package[]>([]);

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    getProjectById(projectId)
      .then(({ data }) => {
        setProject(data);

        return Promise.all([
          getAnalysisContext(data.defaultAnalysisContextId),
          Promise.all(
            data.applications.map((app) => createWatchPromises(app.id))
          ),
        ]);
      })
      .then(([{ data: analysisContextData }, packageMetadataArray]) => {
        setAnalysisContext(analysisContextData);

        // Process packages
        let arrayOfRoots = ([] as any).concat(
          ...packageMetadataArray.map(
            (singlePackageMetadata) => singlePackageMetadata.packageTree
          )
        );
        let mergedRoots = mergePackageRoots(arrayOfRoots);
        mergedRoots.forEach((singleRoot) => putHierarchy(singleRoot));

        const packageTree: Package[] = mergedRoots;
        setPackages(packageTree);

        // Application packages and Third party packages
        const applicationPackages: Package[] = [];
        const thirdPartyPackages: Package[] = [];
        disaggregatePackages(
          packageTree,
          applicationPackages,
          thirdPartyPackages
        );

        setApplicationPackages(applicationPackages);
        setThirdPartyPackages(thirdPartyPackages);

        // Clean error
        setFetchError("");
      })
      .catch((error: AxiosError) => {
        setFetchError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [projectId]);

  return {
    project,
    analysisContext,
    packages,
    applicationPackages,
    thirdPartyPackages,
    isFetching,
    fetchError,
  };
};
