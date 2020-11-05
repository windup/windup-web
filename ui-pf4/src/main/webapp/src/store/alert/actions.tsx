import { Dispatch } from "redux";
import { AxiosError } from "axios";
import { addNotification } from "@redhat-cloud-services/frontend-components-notifications/cjs/actions";

export const alert = (alert: any) => {
  return (dispatch: Dispatch) => {
    dispatch(addNotification(alert));
  };
};

export const alertFetchEndpoint = (err: AxiosError) => {
  let errorDescription = "";
  if (err.response && err.response.data) {
    if (typeof err.response.data === "string") {
      errorDescription = err.response.data;
    } else if (err.response.data.error) {
      errorDescription = err.response.data.error;
    }
  }
  return (dispatch: Dispatch) => {
    dispatch(
      addNotification({
        variant: "danger",
        title: err.message,
        description: errorDescription,
        dismissable: false,
      })
    );
  };
};
