import { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import { alertActions } from "store/alert";
import { deleteDialogActions } from "store/deleteDialog";

import { getAlertModel } from "Constants";
import { WindupExecution } from "models/api";
import { cancelExecution } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export const useCancelExecution = () => {
  const dispatch = useDispatch();

  const cancelExecutionFn = (
    execution: WindupExecution,
    onSuccess?: (execution: WindupExecution) => void
  ) => {
    dispatch(
      deleteDialogActions.openModal({
        name: `analysis #${execution.id.toString()}`,
        type: "analysis",
        config: {
          title: `Cancel analysis #${execution.id.toString()}`,
          message: "Are you sure you want to cancel the analysis?",
          deleteBtnLabel: "Yes",
          cancelBtnLabel: "No",
        },
        onDelete: () => {
          dispatch(deleteDialogActions.processing());
          cancelExecution(execution.id)
            .then(() => {
              if (onSuccess) {
                onSuccess(execution);
              }
            })
            .catch((error: AxiosError) => {
              alertActions.alert(
                getAlertModel("danger", "Error", getAxiosErrorMessage(error))
              );
            })
            .finally(() => {
              dispatch(deleteDialogActions.closeModal());
            });
        },
      })
    );
  };

  return cancelExecutionFn;
};
