import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import styles from "@patternfly/react-styles/css/components/Wizard/wizard";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { ConditionalRender } from "components";
import { useFetchProject } from "hooks/useFetchProject";

import { AdvancedOptionsFieldKey, getAlertModel } from "Constants";
import { formatPath, Paths, ProjectRoute } from "Paths";
import {
  getAnalysisContext,
  createProjectExecution,
  saveAnalysisContext,
} from "api/api";
import { getAxiosErrorMessage } from "utils/modelUtils";

import { useCancelWizard } from "../wizard/useCancelWizard";
import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { getPathFromStep } from "../wizard/wizard-utils";
import { LoadingWizardContent } from "../wizard/loading-content";

const nullabeContent = (value: any) => {
  return value ? (
    value
  ) : (
    <span className="pf-c-content">
      <i>
        <small>none</small>
      </i>
    </span>
  );
};

interface ReviewProps extends RouteComponentProps<ProjectRoute> {}

export const Review: React.FC<ReviewProps> = ({ match, history }) => {
  const dispatch = useDispatch();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    fetchProject: loadProject,
  } = useFetchProject();

  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  const redirectOnCancel = useCancelWizard();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleOnBackStep = () => {
    history.push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = () => redirectOnCancel(history.push);

  const handleSaveAndRun = (createExecution: boolean) => {
    setIsCreatingExecution(true);
    if (project) {
      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          return saveAnalysisContext(project.id, data, false);
        })
        .then(({ data }) => {
          if (createExecution) {
            return createProjectExecution(project.id, data);
          }
        })
        .then(() => {
          if (createExecution) {
            history.push(
              formatPath(Paths.executions, {
                project: project.id,
              })
            );
          } else {
            history.push(Paths.projects);
          }
        })
        .catch((error: AxiosError) => {
          setIsCreatingExecution(false);
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", getAxiosErrorMessage(error))
            )
          );
        });
    }
  };

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push(
      formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      })
    );
  };

  const currentStep = NewProjectWizardStepIds.REVIEW;
  const disableNav = isFetching || isCreatingExecution;
  const canJumpUpto = currentStep;

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      showErrorContent={fetchError}
      onGoToStep={handleOnGoToStep}
      footer={
        <footer className={css(styles.wizardFooter)}>
          <Button
            variant={ButtonVariant.primary}
            onClick={() => handleSaveAndRun(false)}
            isDisabled={disableNav}
          >
            Save
          </Button>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={() => handleSaveAndRun(true)}
            isDisabled={disableNav}
          >
            Save and run
          </Button>
          <Button
            variant={ButtonVariant.secondary}
            onClick={handleOnBackStep}
            isDisabled={disableNav}
          >
            Back
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={handleOnCancel}
            isDisabled={disableNav}
          >
            Cancel
          </Button>
        </footer>
      }
    >
      <ConditionalRender when={isFetching} then={<LoadingWizardContent />}>
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Review project details
              </Title>
              <Text component="small">
                Review the information below, then save your project or save
                your project and run the analysis.
              </Text>
            </TextContent>
          </StackItem>
          {project && analysisContext && (
            <StackItem>
              <DescriptionList isHorizontal>
                <DescriptionListGroup>
                  <DescriptionListTerm>Project name</DescriptionListTerm>
                  <DescriptionListDescription>
                    {project.title}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Description</DescriptionListTerm>
                  <DescriptionListDescription>
                    {nullabeContent(project.description)}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Applications</DescriptionListTerm>
                  <DescriptionListDescription>
                    {project.applications.length}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Target(s)</DescriptionListTerm>
                  <DescriptionListDescription>
                    {analysisContext.advancedOptions
                      .filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
                      .map((f) => f.value)
                      .join(", ")}
                  </DescriptionListDescription>
                </DescriptionListGroup>
                <DescriptionListGroup>
                  <DescriptionListTerm>Source(s)</DescriptionListTerm>
                  <DescriptionListDescription>
                    {nullabeContent(
                      analysisContext.advancedOptions
                        .filter(
                          (f) => f.name === AdvancedOptionsFieldKey.SOURCE
                        )
                        .map((f) => f.value)
                        .join(", ")
                    )}
                  </DescriptionListDescription>
                </DescriptionListGroup>
              </DescriptionList>
            </StackItem>
          )}
        </Stack>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
