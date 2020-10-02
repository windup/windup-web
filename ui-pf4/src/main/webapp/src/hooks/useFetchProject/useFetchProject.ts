import { useState, useEffect } from "react";
import { AxiosError } from "axios";

import { getAnalysisContext, getProjectById } from "api/api";
import { AnalysisContext, MigrationProject } from "models/api";

export interface ISelectionState<T> {
  project?: MigrationProject;
  analysisContext?: AnalysisContext;
  isFetching: boolean;
  fetchError?: string;
}

export const useFetchProject = <T>(
  projectId: number | string
): ISelectionState<T> => {
  const [project, setProject] = useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>();

  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    getProjectById(projectId)
      .then(({ data }) => {
        setProject(data);
        return getAnalysisContext(data.defaultAnalysisContextId);
      })
      .then(({ data }) => {
        setAnalysisContext(data);

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
    isFetching,
    fetchError,
  };
};
