import { AxiosError } from "axios";
import { Package, Technology, WindupExecution } from "models/api";

export const getUnknownPackages = (array: Package[]) => {
  const result: Package[] = [];

  const flatternPackages = (nodes: Package[]) => {
    nodes.forEach((node) => {
      // know=false => application party package
      if (node.known === false) {
        result.push(node);
      } else {
        flatternPackages(node.childs);
      }
    });
  };
  flatternPackages(array);

  return result;
};

export const fullNameToPackage = (
  selectedPackages: string[],
  packages: Package[]
) => {
  const result: Package[] = [];

  const mapPackageFullNamesToPackageObj = (
    fullNames: string[],
    array: Package[]
  ) => {
    for (let i = 0; i < array.length; i++) {
      const elem = array[i];

      const found = fullNames.some((n) => n === elem.fullName);
      if (found) {
        result.push(elem);
      }

      if (result.length === fullNames.length) {
        break;
      }

      if (elem.childs && elem.childs.length > 0) {
        mapPackageFullNamesToPackageObj(fullNames, elem.childs);
      }
    }
  };
  mapPackageFullNamesToPackageObj(selectedPackages, packages);

  return result;
};

// Technology

export const getTechnologyAsString = (f: Technology) => {
  return `${f.name}${f.versionRange ? ":" + f.versionRange : ""}`;
};

// WindupExecution

export const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};

// Axios error
export const getAxiosErrorMessage = (axiosError: AxiosError) => {
  if (axiosError.response?.data.message) {
    return axiosError.response?.data.message;
  }
  return axiosError.message;
};
