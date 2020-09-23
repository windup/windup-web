import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAsyncAction, createAction } from "typesafe-actions";
import { Project } from "models/api";
import { getProjects } from "api/api";

export const {
  request: fetchProjectsRequest,
  success: fetchProjectsSuccess,
  failure: fetchProjectsFailure,
} = createAsyncAction(
  "context/projects/fetch/request",
  "context/projects/fetch/success",
  "context/projects/fetch/failure"
)<void, Project[], AxiosError>();

export const fetchProjectsContext = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchProjectsRequest());

    return getProjects()
      .then((res: AxiosResponse<Project[]>) => {
        dispatch(fetchProjectsSuccess(res.data));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchProjectsFailure(err));
      });
  };
};

export const selectProjectContext = createAction("context/project/select")<
  Project
>();
