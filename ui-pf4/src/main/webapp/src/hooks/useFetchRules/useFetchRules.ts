import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import {
  getGlobalConfiguration,
  getProjectConfiguration,
  getRuleProviderByRulesPathId,
  getRulesetPathsByConfigurationId,
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

        return Promise.all(
          data.map((rulePathElement) =>
            getRuleProviderByRulesPathId(rulePathElement.id).then(
              ({ data: ruleProviderEntities }) => ({
                rulePath: rulePathElement,
                ruleProviders: ruleProviderEntities,
              })
            )
          )
        );
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
        setConfiguration(data);

        const newRulesPath = [...data.rulesPaths];
        setRulesPath(newRulesPath);

        return Promise.all(
          newRulesPath.map((rulePathElement) =>
            getRuleProviderByRulesPathId(rulePathElement.id).then(
              ({ data: ruleProviderEntities }) => ({
                rulePath: rulePathElement,
                ruleProviders: ruleProviderEntities,
              })
            )
          )
        );
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
