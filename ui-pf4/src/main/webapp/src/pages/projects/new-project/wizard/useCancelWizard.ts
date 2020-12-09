import { useCallback } from "react";
import { useDispatch } from "react-redux";

import { deleteDialogActions } from "store/deleteDialog";

import { Paths } from "Paths";

export const useCancelWizard = () => {
  const dispatch = useDispatch();

  const redirectFn = useCallback(
    (push: (path: string) => void) => {
      dispatch(
        deleteDialogActions.openModal({
          name: "",
          type: "",
          config: {
            title: "Cancel",
            message:
              "Are you sure you want to cancel? All the data associated to this project won't be saved.",
            deleteBtnLabel: "Yes",
            cancelBtnLabel: "No",
          },
          onDelete: () => {
            dispatch(deleteDialogActions.closeModal());
            push(Paths.projects);
          },
          onCancel: () => {
            dispatch(deleteDialogActions.closeModal());
          },
        })
      );
    },
    [dispatch]
  );

  return redirectFn;
};
