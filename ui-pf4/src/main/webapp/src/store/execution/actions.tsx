import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAction } from "typesafe-actions";
import { WindupExecution } from "models/api";
import { getExecution } from "api/api";

interface ExecutionActionMeta {
  executionId: number;
}

export const fetchExecutionRequest = createAction("execution/fetch/request")<
  ExecutionActionMeta
>();
export const fetchExecutionSuccess = createAction("execution/fetch/success")<
  WindupExecution,
  ExecutionActionMeta
>();
export const fetchExecutionFailure = createAction("execution/fetch/failure")<
  AxiosError,
  ExecutionActionMeta
>();

export const fetchExecution = (executionId: number) => {
  return (dispatch: Dispatch) => {
    const meta: ExecutionActionMeta = {
      executionId: executionId,
    };

    dispatch(fetchExecutionRequest(meta));

    return getExecution(executionId)
      .then((res: AxiosResponse<WindupExecution>) => {
        dispatch(fetchExecutionSuccess(res.data, meta));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchExecutionFailure(err, meta));
      });
  };
};
