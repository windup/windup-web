import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Paths, formatPath, ProjectRoute } from "Paths";
import { CustomRules } from "containers/custom-rules";
import { useFetchProject } from "hooks/useFetchProject";

import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { useCancelWizard } from "../wizard/useCancelWizard";
import { WizardFooter } from "../wizard/project-wizard-footer";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";

interface SetCustomRulesProps extends RouteComponentProps<ProjectRoute> {}

export const SetCustomRules: React.FC<SetCustomRulesProps> = ({
  match,
  history,
}) => {
  const cancelWizard = useCancelWizard();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const handleOnBack = () => {
    history.push(
      formatPath(Paths.newProject_selectPackages, {
        project: match.params.project,
      })
    );
  };

  const handleOnNext = () => {
    history.push(
      formatPath(Paths.newProject_customLabels, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.CUSTOM_RULES;
  const disableNav = isFetching;
  const canJumpUpto = getMaxAllowedStepToJumpTo(project, analysisContext);

  const footer = (
    <WizardFooter
      isDisabled={disableNav}
      isNextDisabled={disableNav}
      onBack={handleOnBack}
      onNext={handleOnNext}
      onCancel={handleOnCancel}
    />
  );

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      footer={footer}
      showErrorContent={fetchError}
      onGoToStep={handleOnGoToStep}
    >
      <CustomRules
        projectId={match.params.project}
        skipChangeToProvisional={true}
      />
    </NewProjectWizard>
  );
};
