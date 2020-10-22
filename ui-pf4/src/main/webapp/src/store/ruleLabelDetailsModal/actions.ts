import { createAction } from "typesafe-actions";
import {
  LabelProviderEntity,
  LabelsPath,
  RuleLabel,
  RuleProviderEntity,
  RulesPath,
} from "models/api";

interface Item {
  type: RuleLabel;
  path: RulesPath | LabelsPath | undefined;
  providers: RuleProviderEntity[] | LabelProviderEntity[];
  onClose: () => void;
}

export const openModal = createAction("dialog/ruleLabelDetails/open")<Item>();
export const closeModal = createAction("dialog/ruleLabelDetails/close")<void>();
