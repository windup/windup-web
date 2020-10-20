import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import {
  getGlobalConfiguration,
  getProjectConfiguration,
  getRuleProviderByRulesPathId,
  getRulesetPathsByConfigurationId,
  reloadConfiguration,
} from "api/api";
import { Configuration, RuleProviderEntity, RulesPath } from "models/api";

export interface IState {
  configuration?: Configuration;
  rulesPath?: RulesPath[];
  ruleProviders?: Map<RulesPath, RuleProviderEntity[]>;
  isFetching: boolean;
  fetchError?: string;
  loadRules: (projectId: string | number) => void;
  loadGlobalRules: () => void;
}

const mapRulePathToRulePathProviderPromise = (rulePath: RulesPath) => {
  return getRuleProviderByRulesPathId(rulePath.id).then(
    ({ data: ruleProviders }) => ({
      rulePath: rulePath,
      ruleProviders: ruleProviders,
    })
  );
};

export const useFetchRules = (): IState => {
  const [configuration, setConfiguration] = useState<Configuration>();
  const [rulesPath, setRulesPath] = useState<RulesPath[]>();
  const [ruleProviders, setRuleProviders] = useState<
    Map<RulesPath, RuleProviderEntity[]>
  >(new Map());

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const loadRules = useCallback((projectId: string | number) => {
    setIsFetching(true);

    getProjectConfiguration(projectId)
      .then(({ data }) => {
        setConfiguration(data);
        return getRulesetPathsByConfigurationId(data.id);
      })
      .then(({ data }) => {
        setRulesPath(data);

        return Promise.all(data.map(mapRulePathToRulePathProviderPromise));
      })
      .then((responses) => {
        const map: Map<RulesPath, RuleProviderEntity[]> = new Map();
        responses.forEach((element) =>
          map.set(element.rulePath, element.ruleProviders)
        );
        setRuleProviders(map);
      })
      .catch((error: AxiosError) => {
        setFetchError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const loadGlobalRules = useCallback(() => {
    setIsFetching(true);

    getGlobalConfiguration()
      .then(({ data }) => {
        return Promise.all([
          data,
          Promise.all(
            data.rulesPaths.map(mapRulePathToRulePathProviderPromise)
          ),
        ]);
      })
      .then(([configuration, ruleProvidersByRulePath]) => {
        const shouldForceReload = ruleProvidersByRulePath.some((elem) => {
          return (
            elem.rulePath.rulesPathType === "SYSTEM_PROVIDED" &&
            elem.ruleProviders.length === 0
          );
        });

        return Promise.all([
          configuration,
          ruleProvidersByRulePath,
          shouldForceReload,
        ]);
      })
      .then(([configuration, ruleProvidersByRulePath, shouldForceReload]) => {
        const configurationPromise = shouldForceReload
          ? Promise.resolve(reloadConfiguration(configuration))
              .then(({ data }) => data)
              .catch((error) => {
                throw error;
              })
          : Promise.resolve(configuration);

        return Promise.all([
          configurationPromise,
          ruleProvidersByRulePath,
          shouldForceReload,
        ]);
      })
      .then(([configuration, ruleProvidersByRulePath, shouldForceReload]) => {
        const ruleProvidersByRulePathPromise = shouldForceReload
          ? Promise.all(
              configuration.rulesPaths.map(mapRulePathToRulePathProviderPromise)
            )
          : Promise.resolve(ruleProvidersByRulePath);

        return Promise.all([configuration, ruleProvidersByRulePathPromise]);
      })
      .then(([configuration, ruleProvidersByRulePath]) => {
        const rulesMap = ruleProvidersByRulePath.reduce((map, elem) => {
          return map.set(elem.rulePath, elem.ruleProviders);
        }, new Map<RulesPath, RuleProviderEntity[]>());

        setConfiguration(configuration);
        setRulesPath([...configuration.rulesPaths]);
        setRuleProviders(rulesMap);
      })
      .catch((error: AxiosError) => {
        setFetchError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  return {
    configuration,
    rulesPath,
    ruleProviders,
    isFetching,
    fetchError,
    loadRules,
    loadGlobalRules,
  };
};
