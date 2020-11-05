import { useSelector, useDispatch } from "react-redux";
import { AxiosError } from "axios";

import { Project } from "models/api";

import { RootState } from "store/rootReducer";
import {
  projectContextSelectors,
  projectContextActions,
} from "store/projectContext";

export interface IState {
  projects: Project[];
  isFetching: boolean;
  fetchError: AxiosError | undefined;
  fetchContextProjects: () => void;
}

export const useProjectContext = (): IState => {
  const projects = useSelector((state: RootState) =>
    projectContextSelectors.projects(state)
  );
  const projectsFetchStatus = useSelector((state: RootState) =>
    projectContextSelectors.projectsFetchStatus(state)
  );
  const projectsFetchError = useSelector((state: RootState) =>
    projectContextSelectors.projectsFetchError(state)
  );

  const dispatch = useDispatch();

  const handleFetchProjects = () => {
    dispatch(projectContextActions.fetchProjectsContext);
  };

  return {
    projects: projects,
    isFetching: projectsFetchStatus === "inProgress",
    fetchError: projectsFetchError,
    fetchContextProjects: handleFetchProjects,
  };
};
