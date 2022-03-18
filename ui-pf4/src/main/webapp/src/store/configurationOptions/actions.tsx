import { AxiosError, AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { createAsyncAction } from "typesafe-actions";
import { AnalysisContext, ConfigurationOption } from "models/api";
import { getAdvancedConfigurationOptions } from "api/api";

export const {
  request: fetchConfigurationOptionsRequest,
  success: fetchConfigurationOptionsSuccess,
  failure: fetchConfigurationOptionsFailure,
} = createAsyncAction(
  "configurationOptions/fetch/request",
  "configurationOptions/fetch/success",
  "configurationOptions/fetch/failure"
)<void, ConfigurationOption[], AxiosError>();

export const fetchConfigurationOptions = (
  analysisContext?: AnalysisContext
) => {
  return (dispatch: Dispatch) => {
    dispatch(fetchConfigurationOptionsRequest());

    return getAdvancedConfigurationOptions(analysisContext)
      .then((res: AxiosResponse) => {
        dispatch(fetchConfigurationOptionsSuccess(res.data));
      })
      .catch((err: AxiosError) => {
        dispatch(fetchConfigurationOptionsFailure(err));
      });
  };
};
