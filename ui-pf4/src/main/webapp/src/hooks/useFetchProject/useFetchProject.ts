import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import { getAnalysisContext, getProjectById } from "api/api";
import { AnalysisContext, MigrationProject } from "models/api";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchProject/fetch/request",
  "useFetchProject/fetch/success",
  "useFetchProject/fetch/failure"
)<
  void,
  { project: MigrationProject; analysisContext: AnalysisContext },
  AxiosError
>();

type State = Readonly<{
  isFetching: boolean;
  project?: MigrationProject;
  analysisContext?: AnalysisContext;
  fetchError?: AxiosError;
}>;

const defaultState: State = {
  isFetching: false,
  project: undefined,
  analysisContext: undefined,
  fetchError: undefined,
};

type Action = ActionType<
  typeof fetchRequest | typeof fetchSuccess | typeof fetchFailure
>;

const initReducer = (initialCount: State): State => {
  return initialCount;
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(fetchRequest):
      return {
        ...state,
        isFetching: true,
      };
    case getType(fetchSuccess):
      return {
        ...state,
        isFetching: false,
        fetchError: undefined,
        project: action.payload.project,
        analysisContext: action.payload.analysisContext,
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
      };
    default:
      return state;
  }
};

export interface IState {
  project?: MigrationProject;
  analysisContext?: AnalysisContext;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchProject: (projectId: string | number) => void;
}

export const useFetchProject = (initialState: State = defaultState): IState => {
  const [state, dispatch] = useReducer(reducer, initialState, initReducer);

  const fetchProject = useCallback((projectId: string | number) => {
    dispatch(fetchRequest());

    getProjectById(projectId)
      .then(({ data }) => {
        return Promise.all([
          data,
          getAnalysisContext(data.defaultAnalysisContextId),
        ]);
      })
      .then(([project, { data }]) => {
        dispatch(
          fetchSuccess({
            project: project,
            analysisContext: data,
          })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(fetchFailure(error));
      });
  }, []);

  return {
    project: state.project,
    analysisContext: state.analysisContext,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchProject,
  };
};
