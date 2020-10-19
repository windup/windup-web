import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";

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

import { useFetchProject } from "hooks/useFetchProject";

import { AdvancedOptionsFieldKey, getAlertModel } from "Constants";
import { formatPath, Paths, ProjectRoute } from "Paths";
import {
  getAnalysisContext,
  createProjectExecution,
  saveAnalysisContext,
} from "api/api";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
  useWizardCancelRedirect,
} from "../wizard";
import { AxiosError } from "axios";
import { getAxiosErrorMessage } from "utils/modelUtils";
import { ConditionalRender } from "components";

interface ReviewProps extends RouteComponentProps<ProjectRoute> {}

export const Review: React.FC<ReviewProps> = ({ match, history: { push } }) => {
  const dispatch = useDispatch();

  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    loadProject,
  } = useFetchProject();

  const [isCreatingExecution, setIsCreatingExecution] = useState(false);

  const redirectOnCancel = useWizardCancelRedirect();

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  const handleOnBackStep = () => {
    push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  const handleOnCancel = useCallback(() => {
    redirectOnCancel(push, project);
  }, [project, push, redirectOnCancel]);

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
            push(
              formatPath(Paths.executions, {
                project: project.id,
              })
            );
          } else {
            push(Paths.projects);
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

  return (
    <NewProjectWizard
      stepId={WizardStepIds.REVIEW}
      enableNext={true}
      disableNavigation={isFetching || isCreatingExecution}
      migrationProject={project}
      showErrorContent={fetchError}
      footer={
        <footer className={css(styles.wizardFooter)}>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={() => handleSaveAndRun(false)}
            isDisabled={isFetching || isCreatingExecution}
          >
            Save
          </Button>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={() => handleSaveAndRun(true)}
            isDisabled={isFetching || isCreatingExecution}
          >
            Save and run
          </Button>
          <Button
            variant={ButtonVariant.secondary}
            onClick={handleOnBackStep}
            isDisabled={isFetching || isCreatingExecution}
          >
            Back
          </Button>
          <Button
            variant={ButtonVariant.link}
            onClick={handleOnCancel}
            isDisabled={isFetching || isCreatingExecution}
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
                    {project.description}
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
                {/* <DescriptionListGroup>
                  <DescriptionListTerm>Annotation</DescriptionListTerm>
                  <DescriptionListDescription>
                    2 Annotations
                  </DescriptionListDescription>
                </DescriptionListGroup> */}
              </DescriptionList>
            </StackItem>
          )}
        </Stack>
      </ConditionalRender>
    </NewProjectWizard>
  );
};
