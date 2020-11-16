import { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import { alertActions } from "store/alert";
import { deleteDialogActions } from "store/deleteDialog";

import { getAlertModel } from "Constants";
import { WindupExecution } from "models/api";
import { deleteExecution } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export const useDeleteExecution = () => {
  const dispatch = useDispatch();

  const deleteExecutionFn = (
    execution: WindupExecution,
    onSuccess?: (execution: WindupExecution) => void,
    onCancel?: () => void
  ) => {
    dispatch(
      deleteDialogActions.openModal({
        name: `#${execution.id.toString()}`,
        type: "analysis",
        onDelete: () => {
          dispatch(deleteDialogActions.processing());
          deleteExecution(execution.id)
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
        onCancel: () => {
          dispatch(deleteDialogActions.closeModal());
          if (onCancel) {
            onCancel();
          }
        },
      })
    );
  };

  return deleteExecutionFn;
};
