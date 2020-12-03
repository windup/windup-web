import { withRouter } from "react-router-dom";
import { NewProjectWizard } from "./project-wizard";

import { ErrorWizardContent } from "./error-content";
import { LoadingWizardContent } from "./loading-content";
import { WizardStepIds } from "./project-wizard";
import { useCancelWizard } from "./useCancelWizard";

export {
  ErrorWizardContent,
  LoadingWizardContent,
  WizardStepIds,
  useCancelWizard,
};
export default withRouter(NewProjectWizard);
