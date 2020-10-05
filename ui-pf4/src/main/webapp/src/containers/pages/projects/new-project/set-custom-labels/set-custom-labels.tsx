import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Paths, formatPath } from "Paths";
import { CustomLabels } from "containers/custom-labels";
import { useFetchProject } from "hooks/useFetchProject";

import NewProjectWizard, { WizardStepIds } from "../wizard";

interface SetCustomLabelsProps
  extends RouteComponentProps<{ project: string }> {}

export const SetCustomLabels: React.FC<SetCustomLabelsProps> = ({
  match,
  history: { push },
}) => {
  const {
    project,
    analysisContext,
    fetchError,
    loadProject,
  } = useFetchProject();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleOnNextStep = () => {
    push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.CUSTOM_LABELS}
      enableNext={true}
      disableNavigation={false}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      analysisContext={analysisContext}
      showErrorContent={fetchError}
    >
      <CustomLabels projectId={match.params.project} />
    </NewProjectWizard>
  );
};
