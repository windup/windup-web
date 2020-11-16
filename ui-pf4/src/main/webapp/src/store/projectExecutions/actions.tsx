import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { WindupExecution } from "models/api";
import { getProjectExecutions } from "api/api";

interface ExecutionActionMeta {
  projectId: string | number;
}

export const fetchProjectExecutionsRequest = createAction(
  "projectExecutions/fetch/request"
)<ExecutionActionMeta>();
export const fetchProjectExecutionsSuccess = createAction(
  "projectExecutions/fetch/success"
)<WindupExecution[], ExecutionActionMeta>();
export const fetchProjectExecutionsFailure = createAction(
  "projectExecutions/fetch/failure"
)<AxiosError, ExecutionActionMeta>();

export const fetchProjectExecutions = (projectId: string | number) => {
  return (dispatch: Dispatch) => {
    const meta: ExecutionActionMeta = {
      projectId: projectId,
    };

    dispatch(fetchProjectExecutionsRequest(meta));

    return getProjectExecutions(projectId)
      .then((res: AxiosResponse<WindupExecution[]>) => {
        dispatch(fetchProjectExecutionsSuccess(res.data, meta));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchProjectExecutionsFailure(err, meta));
      });
  };
};
