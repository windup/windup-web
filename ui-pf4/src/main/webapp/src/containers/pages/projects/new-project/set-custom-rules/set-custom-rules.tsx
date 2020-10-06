import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Paths, formatPath, ProjectRoute } from "Paths";
import { CustomRules } from "containers/custom-rules";
import { useFetchProject } from "hooks/useFetchProject";

import NewProjectWizard, { WizardStepIds } from "../wizard";

interface SetCustomRulesProps extends RouteComponentProps<ProjectRoute> {}

export const SetCustomRules: React.FC<SetCustomRulesProps> = ({
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
      formatPath(Paths.newProject_customLabels, {
        project: match.params.project,
      })
    );
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.CUSTOM_RULES}
      enableNext={true}
      disableNavigation={false}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      analysisContext={analysisContext}
      showErrorContent={fetchError}
    >
      <CustomRules projectId={match.params.project} />
    </NewProjectWizard>
  );
};
