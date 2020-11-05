import { useState, useCallback } from "react";
import { AxiosError } from "axios";

import { getAnalysisContext, getProjectById } from "api/api";
import { AnalysisContext, MigrationProject } from "models/api";

export interface IState {
  project?: MigrationProject;
  analysisContext?: AnalysisContext;
  isFetching: boolean;
  fetchError?: string;
  loadProject: (projectId: string | number) => void;
}

export const useFetchProject = (): IState => {
  const [project, setProject] = useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = useState<AnalysisContext>();

  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const loadProject = useCallback((projectId: string | number) => {
    setIsFetching(true);

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
  }, []);

  return {
    project,
    analysisContext,
    isFetching,
    fetchError,
    loadProject,
  };
};
