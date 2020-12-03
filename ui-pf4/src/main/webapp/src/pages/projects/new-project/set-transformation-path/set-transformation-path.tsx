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

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
} from "../wizard";

interface SetTransformationPathProps
  extends RouteComponentProps<ProjectRoute> {}

export const SetTransformationPath: React.FC<SetTransformationPathProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOnNextStep = () => {
    onSubmit();
  };

  const onSubmit = () => {
    if (!project) {
      return;
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
        push(
          formatPath(Paths.newProject_selectPackages, {
            project: project.id,
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
    setSelectedTargets(values);
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.SET_TRANSFORMATION_PATH}
      enableNext={selectedTargets.length > 0}
      disableNavigation={isFetching || isSubmitting}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      analysisContext={analysisContext}
      showErrorContent={fetchError}
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
