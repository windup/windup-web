import { AxiosError } from "axios";
import { AdvancedOptionsFieldKey } from "Constants";
import {
  LabelProviderEntity,
  Package,
  RuleProviderEntity,
  Technology,
  WindupExecution,
} from "models/api";

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

export const arePackagesEquals = (a: Package[], b: Package[]) => {
  const packagesChanged =
    a.length !== b.length ||
    !a.every((elem1) => b.some((elem2) => elem2.fullName === elem1.fullName));
  return !packagesChanged;
};

// Technology

export const getTechnologyAsString = (f: Technology) => {
  return `${f.name}${f.versionRange ? ":" + f.versionRange : ""}`;
};

// WindupExecution

export const isExecutionActive = (execution: WindupExecution) => {
  return execution.state === "STARTED" || execution.state === "QUEUED";
};

export const isOptionEnabledInExecution = (
  execution: WindupExecution,
  option: AdvancedOptionsFieldKey
) => {
  return (
    execution.analysisContext.advancedOptions.findIndex(
      (f) => f.name === option && f.value === "true"
    ) !== -1
  );
};

// RuleProviderEntity
export const getSourcesFromRuleProviderEntity = (
  ruleProviderEntities: RuleProviderEntity[]
) => {
  return ruleProviderEntities.reduce((collection, element) => {
    element.sources.forEach((f) => {
      collection.add(getTechnologyAsString(f));
    });
    return collection;
  }, new Set<string>());
};

export const getTargetsFromRuleProviderEntity = (
  ruleProviderEntities: RuleProviderEntity[]
) => {
  return ruleProviderEntities.reduce((collection, element) => {
    element.targets.forEach((f) => {
      collection.add(getTechnologyAsString(f));
    });
    return collection;
  }, new Set<string>());
};

export const getNumberOfRulesFromRuleProviderEntity = (
  ruleProviderEntities: RuleProviderEntity[]
) => {
  return ruleProviderEntities.reduce(
    (counter, element) => counter + element.rules.length,
    0
  );
};

export const getErrorsFromRuleProviderEntity = (
  ruleProviderEntities: RuleProviderEntity[]
) => {
  return ruleProviderEntities.reduce((errors, element) => {
    return element.loadError ? [...errors, element.loadError] : [...errors];
  }, [] as string[]);
};

// LabelProviderEntity

export const getNumberOfLabelsFromLabelProviderEntity = (
  labelProviderEntities: LabelProviderEntity[]
) => {
  return labelProviderEntities.reduce(
    (counter, element) => counter + element.labels.length,
    0
  );
};

export const getErrorsFromLabelProviderEntity = (
  labelProviderEntities: LabelProviderEntity[]
) => {
  return labelProviderEntities.reduce((errors, element) => {
    return element.loadError ? [...errors, element.loadError] : [...errors];
  }, [] as string[]);
};

// Axios error
export const getAxiosErrorMessage = (axiosError: AxiosError) => {
  if (axiosError.response?.data.message) {
    return axiosError.response?.data.message;
  }
  return axiosError.message;
};
