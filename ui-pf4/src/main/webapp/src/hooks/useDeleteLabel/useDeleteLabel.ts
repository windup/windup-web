import { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import { alertActions } from "store/alert";
import { deleteDialogActions } from "store/deleteDialog";

import { getAlertModel } from "Constants";
import { LabelsPath } from "models/api";
import { deleteLabelPathById, isLabelPathBeingUsed } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export const useDeleteLabel = () => {
  const dispatch = useDispatch();

  const deleteLabel = (
    labelPath: LabelsPath,
    onSuccess?: (labelPath: LabelsPath) => void,
    onCancel?: () => void
  ) => {
    dispatch(
      deleteDialogActions.openModal({
        name: labelPath.shortPath || labelPath.path,
        type: "labelPath",
        onDelete: () => {
          dispatch(deleteDialogActions.processing);

          isLabelPathBeingUsed(labelPath.id)
            .then(({ data: isLabelPathBeingUsed }) => {
              if (!isLabelPathBeingUsed) {
                deleteLabelPathById(labelPath.id)
                  .then(() => {
                    if (onSuccess) {
                      onSuccess(labelPath);
                    }
                    if (onSuccess) {
                    }
                  })
                  .catch((error: AxiosError) => {
                    alertActions.alert(
                      getAlertModel(
                        "danger",
                        "Error",
                        getAxiosErrorMessage(error)
                      )
                    );
                  });
              } else {
                dispatch(
                  alertActions.alert(
                    getAlertModel(
                      "danger",
                      "Error",
                      "LabelPath is being used, you can not delete it"
                    )
                  )
                );
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

  return deleteLabel;
};
