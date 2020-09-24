import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { WindupExecution } from "models/api";
import { getProjectExecutions } from "api/api";

interface ExecutionActionMeta {
  projectId: string | number;
}

export const fetchExecutionsRequest = createAction("executions/fetch/request")<
  ExecutionActionMeta
>();
export const fetchExecutionsSuccess = createAction("executions/fetch/success")<
  WindupExecution[],
  ExecutionActionMeta
>();
export const fetchExecutionFailure = createAction("executions/fetch/failure")<
  AxiosError,
  ExecutionActionMeta
>();

export const fetchExecutions = (projectId: string | number) => {
  return (dispatch: Dispatch) => {
    const meta: ExecutionActionMeta = {
      projectId: projectId,
    };

    dispatch(fetchExecutionsRequest(meta));

    return getProjectExecutions(projectId)
      .then((res: AxiosResponse<WindupExecution[]>) => {
        dispatch(fetchExecutionsSuccess(res.data, meta));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchExecutionFailure(err, meta));
      });
  };
};
