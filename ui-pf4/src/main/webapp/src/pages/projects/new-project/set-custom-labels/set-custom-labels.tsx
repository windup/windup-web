import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";

import { Paths, formatPath, ProjectRoute } from "Paths";
import { CustomLabels } from "containers/custom-labels";
import { useFetchProject } from "hooks/useFetchProject";

import { useCancelWizard } from "../wizard/useCancelWizard";
import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";
import { WizardFooter } from "../wizard/project-wizard-footer";

interface SetCustomLabelsProps extends RouteComponentProps<ProjectRoute> {}

export const SetCustomLabels: React.FC<SetCustomLabelsProps> = ({
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

  const onGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: project?.id,
      })
    );
  };

  const handleOnBack = () => {
    history.push(
      formatPath(Paths.newProject_customRules, {
        project: match.params.project,
      })
    );
  };

  const handleOnNext = () => {
    history.push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const currentStep = NewProjectWizardStepIds.CUSTOM_LABELS;
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
      onGoToStep={onGoToStep}
    >
      <CustomLabels
        projectId={match.params.project}
        skipChangeToProvisional={true}
      />
    </NewProjectWizard>
  );
};
