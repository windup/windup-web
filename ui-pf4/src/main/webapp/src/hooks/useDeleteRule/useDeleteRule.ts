import { AxiosError } from "axios";
import { useDispatch } from "react-redux";

import { alertActions } from "store/alert";
import { deleteDialogActions } from "store/deleteDialog";

import { getAlertModel } from "Constants";
import { RulesPath } from "models/api";
import { deleteRulePathById, isRulePathBeingUsed } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

export const useDeleteRule = () => {
  const dispatch = useDispatch();

  const deleteRule = (
    rulePath: RulesPath,
    onSuccess?: (rulePath: RulesPath) => void
  ) => {
    dispatch(
      deleteDialogActions.openModal({
        name: rulePath.shortPath || rulePath.path,
        type: "rulePath",
        onDelete: () => {
          dispatch(deleteDialogActions.processing());

          isRulePathBeingUsed(rulePath.id)
            .then(({ data: isRulePathBeingUsed }) => {
              if (!isRulePathBeingUsed) {
                deleteRulePathById(rulePath.id)
                  .then(() => {
                    if (onSuccess) {
                      onSuccess(rulePath);
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
                  })
                  .finally(() => {
                    dispatch(deleteDialogActions.closeModal());
                  });
              } else {
                dispatch(
                  alertActions.alert(
                    getAlertModel(
                      "danger",
                      "Error",
                      "RulePath is being used, you can not delete it"
                    )
                  )
                );
              }
            })
            .catch((error: AxiosError) => {
              alertActions.alert(
                getAlertModel("danger", "Error", getAxiosErrorMessage(error))
              );
            });
        },
      })
    );
  };

  return deleteRule;
};
