import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import {
  getProjectConfiguration,
  getLabelProviderByLabelsPathId,
  getLabelsetPathsByConfigurationId,
  getGlobalConfiguration,
  reloadConfiguration,
} from "api/api";
import { Configuration, LabelProviderEntity, LabelsPath } from "models/api";

export interface IState {
  configuration?: Configuration;
  labelsPath?: LabelsPath[];
  labelProviders?: Map<number, LabelProviderEntity[]>;
  isFetching: boolean;
  fetchError?: string;
  loadLabels: (projectId: string | number) => void;
  loadGlobalLabels: () => void;
}

const mapLabelPathToLabelPathProviderPromise = (labelPath: LabelsPath) => {
  return getLabelProviderByLabelsPathId(labelPath.id).then(
    ({ data: labelProviders }) => ({
      labelPath: labelPath,
      labelProviders: labelProviders,
    })
  );
};

export const useFetchLabels = (): IState => {
  const [configuration, setConfiguration] = useState<Configuration>();
  const [labelsPath, setLabelsPath] = useState<LabelsPath[]>();
  const [labelProviders, setLabelProviders] = useState<
    Map<number, LabelProviderEntity[]>
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

        return Promise.all(data.map(mapLabelPathToLabelPathProviderPromise));
      })
      .then((responses) => {
        const map: Map<number, LabelProviderEntity[]> = new Map();
        responses.forEach((element) =>
          map.set(element.labelPath.id, element.labelProviders)
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
        return Promise.all([
          data,
          Promise.all(
            data.labelsPaths.map(mapLabelPathToLabelPathProviderPromise)
          ),
        ]);
      })
      .then(([configuration, labelProvidersByLabelPath]) => {
        const shouldForceReload = labelProvidersByLabelPath.some((elem) => {
          return (
            elem.labelPath.labelsPathType === "SYSTEM_PROVIDED" &&
            elem.labelProviders.length === 0
          );
        });

        return Promise.all([
          configuration,
          labelProvidersByLabelPath,
          shouldForceReload,
        ]);
      })
      .then(([configuration, labelProvidersByLabelPath, shouldForceReload]) => {
        const configurationPromise = shouldForceReload
          ? Promise.resolve(reloadConfiguration(configuration))
              .then(({ data }) => data)
              .catch((error) => {
                throw error;
              })
          : Promise.resolve(configuration);

        return Promise.all([
          configurationPromise,
          labelProvidersByLabelPath,
          shouldForceReload,
        ]);
      })
      .then(([configuration, labelProvidersByLabelPath, shouldForceReload]) => {
        const labelProvidersByLabelPathPromise = shouldForceReload
          ? Promise.all(
              configuration.labelsPaths.map(
                mapLabelPathToLabelPathProviderPromise
              )
            )
          : Promise.resolve(labelProvidersByLabelPath);

        return Promise.all([configuration, labelProvidersByLabelPathPromise]);
      })
      .then(([configuration, labelProvidersByLabelPath]) => {
        const labelsMap = labelProvidersByLabelPath.reduce((map, elem) => {
          return map.set(elem.labelPath.id, elem.labelProviders);
        }, new Map<number, LabelProviderEntity[]>());

        setConfiguration(configuration);
        setLabelsPath([...configuration.labelsPaths]);
        setLabelProviders(labelsMap);
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
