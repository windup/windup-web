import {
  LabelProviderEntity,
  LabelsPath,
  RuleProviderEntity,
  RulesPath,
} from "models/api";
import { ActionType, getType } from "typesafe-actions";
import { closeModal, ModalType, openModal } from "./actions";

export const stateKey = "ruleLabelDetailsModal";

export type RuleLabelDetailsModalState = Readonly<{
  isOpen: boolean;
  type: ModalType;
  path?: RulesPath | LabelsPath;
  providers: RuleProviderEntity[] | LabelProviderEntity[];
  onClose: () => void;
}>;

export const defaultState: RuleLabelDetailsModalState = {
  isOpen: false,
  type: "Rule",
  path: undefined,
  providers: [],
  onClose: () => {},
};

export type RuleLabelDetailsModalAction = ActionType<
  typeof openModal | typeof closeModal
>;

export const reducer = (
  state: RuleLabelDetailsModalState = defaultState,
  action: RuleLabelDetailsModalAction
): RuleLabelDetailsModalState => {
  switch (action.type) {
    case getType(openModal):
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    case getType(closeModal):
      return defaultState;
    default:
      return state;
  }
};
