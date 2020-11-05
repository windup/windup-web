import { withRouter } from "react-router-dom";
import { NewProjectWizard } from "./project-wizard";

import { ErrorWizardContent } from "./error-content";
import { LoadingWizardContent } from "./loading-content";
import { WizardStepIds } from "./project-wizard";
import { useWizardCancelRedirect } from "./useWizardCancelRedirect";

export {
  ErrorWizardContent,
  LoadingWizardContent,
  WizardStepIds,
  useWizardCancelRedirect,
};
export default withRouter(NewProjectWizard);
