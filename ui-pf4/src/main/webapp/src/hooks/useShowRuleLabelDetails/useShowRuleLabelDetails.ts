import { useDispatch } from "react-redux";

import { ruleLabelDetailsModalActions } from "store/ruleLabelDetailsModal";

import {
  LabelProviderEntity,
  LabelsPath,
  RuleProviderEntity,
  RulesPath,
} from "models/api";

export const useShowRuleLabelDetails = () => {
  const dispatch = useDispatch();

  const showModal = (
    type: "Rule" | "Label",
    path: RulesPath | LabelsPath | undefined,
    providers: RuleProviderEntity[] | LabelProviderEntity[],
    onClose?: () => void
  ) => {
    dispatch(
      ruleLabelDetailsModalActions.openModal({
        type: type,
        path: path,
        providers: providers,
        onClose: () => {
          dispatch(ruleLabelDetailsModalActions.closeModal());

          if (onClose) {
            onClose();
          }
        },
      })
    );
  };

  return showModal;
};
