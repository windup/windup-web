import { AxiosError } from "axios";
import { AdvancedOptionsFieldKey } from "Constants";
import {
  AnalysisContext,
  LabelProviderEntity,
  Package,
  RuleProviderEntity,
  RulesPath,
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
  ruleProviderEntities: RuleProviderEntity[],
  onlyTechnologyNames: boolean = false
) => {
  return ruleProviderEntities.reduce((collection, element) => {
    element.sources.forEach((f) => {
      collection.add(!onlyTechnologyNames ? getTechnologyAsString(f) : f.name);
    });
    return collection;
  }, new Set<string>());
};

export const getTargetsFromRuleProviderEntity = (
  ruleProviderEntities: RuleProviderEntity[],
  onlyTechnologyNames: boolean = false
) => {
  return ruleProviderEntities.reduce((collection, element) => {
    element.targets.forEach((f) => {
      collection.add(!onlyTechnologyNames ? getTechnologyAsString(f) : f.name);
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

export const getEnabledCustomSourcesAndTargets = (
  analysisContext: AnalysisContext,
  rulesPath: RulesPath[],
  ruleProviders: Map<number, RuleProviderEntity[]>
) => {
  const enabledRuleProviderEntities = rulesPath
    .filter((rulePath) => {
      return !!analysisContext?.rulesPaths.find((f) => f.id === rulePath.id);
    })
    .map((f) => (ruleProviders ? ruleProviders.get(f.id) || [] : []));

  const customSources = enabledRuleProviderEntities
    .map((ruleProviderEntity) => {
      return getSourcesFromRuleProviderEntity(ruleProviderEntity, true);
    })
    .reduce((accumulator, current) => {
      return new Set([
        ...Array.from(accumulator.values()),
        ...Array.from(current.values()),
      ]);
    }, new Set<string>());

  const customTargets = enabledRuleProviderEntities
    ?.map((ruleProviderEntity) =>
      getTargetsFromRuleProviderEntity(ruleProviderEntity, true)
    )
    .reduce((accumulator, current) => {
      return new Set([
        ...Array.from(accumulator.values()),
        ...Array.from(current.values()),
      ]);
    }, new Set<string>());

  return { sources: customSources, targets: customTargets };
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
