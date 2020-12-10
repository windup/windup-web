import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";

import { TransformationPath } from "components";
import { useFetchProject } from "hooks/useFetchProject";

import { alertActions } from "store/alert";

import { AdvancedOptionsFieldKey, getAlertModel, TARGET_EAP7 } from "Constants";
import { Paths, formatPath, ProjectRoute } from "Paths";
import { AnalysisContext, AdvancedOption } from "models/api";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { useCancelWizard } from "../wizard/useCancelWizard";
import { WizardFooter } from "../wizard/project-wizard-footer";
import { LoadingWizardContent } from "../wizard/loading-content";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";

interface SetTransformationPathProps
  extends RouteComponentProps<ProjectRoute> {}

export const SetTransformationPath: React.FC<SetTransformationPathProps> = ({
  match,
  history,
}) => {
  const dispatch = useDispatch();
  const cancelWizard = useCancelWizard();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  useEffect(() => {
    if (analysisContext) {
      const targets = analysisContext.advancedOptions.filter(
        (f) => f.name === AdvancedOptionsFieldKey.TARGET
      );
      setSelectedTargets(
        targets.length > 0 ? targets.map((f) => f.value) : [TARGET_EAP7]
      );
    }
  }, [analysisContext]);

  const handleOnSubmit = () => {
    if (!project) {
      throw new Error("Undefined project, can not handle submit");
    }

    setIsSubmitting(true);
    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        const newAnalysisContext: AnalysisContext = {
          ...data,
          advancedOptions: [
            ...data.advancedOptions.filter((f) => {
              return f.name !== AdvancedOptionsFieldKey.TARGET;
            }),
            ...selectedTargets.map((f) => {
              return {
                name: AdvancedOptionsFieldKey.TARGET,
                value: f,
              } as AdvancedOption;
            }),
          ],
        };
        return saveAnalysisContext(
          match.params.project,
          newAnalysisContext,
          true
        );
      })
      .then(() => {
        history.push(
          formatPath(Paths.newProject_selectPackages, {
            project: match.params.project,
          })
        );
      })
      .catch((error: AxiosError) => {
        setIsSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  const handleTargetSelectionChange = (values: string[]) => {
    setDirty(true);
    setSelectedTargets(values);
  };

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const handleOnNext = () => {
    handleOnSubmit();
  };

  const handleOnBack = () => {
    history.push(
      formatPath(Paths.newProject_addApplications, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const isValid = selectedTargets.length > 0;
  const currentStep = NewProjectWizardStepIds.SET_TRANSFORMATION_PATH;
  const disableNav = isFetching || isSubmitting;
  const canJumpUpto =
    !isValid || dirty
      ? currentStep
      : getMaxAllowedStepToJumpTo(project, analysisContext);

  const footer = (
    <WizardFooter
      isDisabled={disableNav}
      isNextDisabled={disableNav || !isValid}
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
      <TransformationPath
        selectedTargets={selectedTargets}
        onSelectedTargetsChange={handleTargetSelectionChange}
        isFetching={isFetching}
        isFetchingPlaceholder={<LoadingWizardContent />}
      />
    </NewProjectWizard>
  );
};
