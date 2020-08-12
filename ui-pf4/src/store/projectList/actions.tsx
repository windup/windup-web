import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAsyncAction } from "typesafe-actions";
import { Project } from "../../models/api";
import { getProjects } from "../../api/api";

export const {
  request: fetchProjectListRequest,
  success: fetchProjectListSuccess,
  failure: fetchProjectListFailure,
} = createAsyncAction(
  "projectList/fetch/request",
  "projectList/fetch/success",
  "projectList/fetch/failure"
)<void, Project[], AxiosError>();

export const fetchProjects = () => {
  return (dispatch: Dispatch) => {
    dispatch(fetchProjectListRequest());

    return getProjects()
      .then((res: AxiosResponse) => {
        dispatch(fetchProjectListSuccess(res.data));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchProjectListFailure(err));
      });
  };
};
