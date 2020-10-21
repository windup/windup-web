import { createAction } from "typesafe-actions";
import {
  LabelProviderEntity,
  LabelsPath,
  RuleProviderEntity,
  RulesPath,
} from "models/api";

export type ModalType = "Rule" | "Label";

interface Item {
  type: ModalType;
  path: RulesPath | LabelsPath | undefined;
  providers: RuleProviderEntity[] | LabelProviderEntity[];
  onClose: () => void;
}

export const openModal = createAction("dialog/ruleLabelDetails/open")<Item>();
export const closeModal = createAction("dialog/ruleLabelDetails/close")<void>();
