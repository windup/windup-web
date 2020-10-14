import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import {
  getProjectConfiguration,
  getLabelProviderByLabelsPathId,
  getLabelsetPathsByConfigurationId,
  getGlobalConfiguration,
} from "api/api";
import { Configuration, LabelProviderEntity, LabelsPath } from "models/api";

export interface IState {
  configuration?: Configuration;
  labelsPath?: LabelsPath[];
  labelProviders?: Map<LabelsPath, LabelProviderEntity[]>;
  isFetching: boolean;
  fetchError?: string;
  loadLabels: (projectId: string | number) => void;
  loadGlobalLabels: () => void;
}

export const useFetchLabels = (): IState => {
  const [configuration, setConfiguration] = useState<Configuration>();
  const [labelsPath, setLabelsPath] = useState<LabelsPath[]>();
  const [labelProviders, setLabelProviders] = useState<
    Map<LabelsPath, LabelProviderEntity[]>
  >(new Map());

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const loadLabels = useCallback((projectId: string | number) => {
    setIsFetching(true);

    getProjectConfiguration(projectId)
      .then(({ data }) => {
        setConfiguration(data);
        return getLabelsetPathsByConfigurationId(data.id);
      })
      .then(({ data }) => {
        setLabelsPath(data);

        return Promise.all(
          data.map((labelPathElement) =>
            getLabelProviderByLabelsPathId(labelPathElement.id).then(
              ({ data: labelProviderEntities }) => ({
                labelPath: labelPathElement,
                labelProviders: labelProviderEntities,
              })
            )
          )
        );
      })
      .then((responses) => {
        const map: Map<LabelsPath, LabelProviderEntity[]> = new Map();
        responses.forEach((element) =>
          map.set(element.labelPath, element.labelProviders)
        );
        setLabelProviders(map);
      })
      .catch((error: AxiosError) => {
        setFetchError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, []);

  const loadGlobalLabels = useCallback(() => {
    setIsFetching(true);

    getGlobalConfiguration()
      .then(({ data }) => {
        setConfiguration(data);

        const newLabelsPath = [...data.labelsPaths];
        setLabelsPath(newLabelsPath);

        return Promise.all(
          newLabelsPath.map((rulePathElement) =>
            getLabelProviderByLabelsPathId(rulePathElement.id).then(
              ({ data: ruleProviderEntities }) => ({
                rulePath: rulePathElement,
                ruleProviders: ruleProviderEntities,
              })
            )
          )
        );
      })
      .then((responses) => {
        const map: Map<LabelsPath, LabelProviderEntity[]> = new Map();
        responses.forEach((element) =>
          map.set(element.rulePath, element.ruleProviders)
        );
        setLabelProviders(map);
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
    labelsPath,
    labelProviders,
    isFetching,
    fetchError,
    loadLabels,
    loadGlobalLabels,
  };
};
