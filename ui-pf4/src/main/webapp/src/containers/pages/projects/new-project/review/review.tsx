import React from "react";
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

import { formatPath, Paths } from "Paths";
import {
  getProjectById,
  getAnalysisContext,
  createProjectExecution,
} from "api/api";
import { MigrationProject, AnalysisContext } from "models/api";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
} from "../wizard";
import { AdvancedOptionsFieldKey } from "Constants";

interface ReviewProps extends RouteComponentProps<{ project: string }> {}

export const Review: React.FC<ReviewProps> = ({ match, history: { push } }) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

  const [isCreatingExecution, setIsCreatingExecution] = React.useState(false);

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);

        return getAnalysisContext(projectData.defaultAnalysisContextId);
      })
      .then(({ data: analysisContextData }) => {
        setAnalysisContext(analysisContextData);
      })
      .catch(() => {
        setFetchError("Error while fetching migrationProject/analysisContext");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleOnBackStep = () => {
    push(
      formatPath(Paths.newProject_advandedOptions, {
        project: match.params.project,
      })
    );
  };

  const handleOnNextStep = () => {
    push(Paths.projects);
  };

  const handleSaveAndRun = () => {
    setIsCreatingExecution(true);
    if (project) {
      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          return createProjectExecution(project.id, data);
        })
        .then(() => {
          push(
            formatPath(Paths.executions, {
              project: match.params.project,
            })
          );
        })
        .catch(() => {
          setIsCreatingExecution(false);
        });
    }
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.REVIEW}
      enableNext={true}
      disableNavigation={isFetching || isCreatingExecution}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      showErrorContent={fetchError}
      footer={
        <footer className={css(styles.wizardFooter)}>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={handleOnNextStep}
            isDisabled={isFetching || isCreatingExecution}
          >
            Save
          </Button>
          <Button
            variant={ButtonVariant.primary}
            type="submit"
            onClick={handleSaveAndRun}
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
            onClick={handleOnNextStep}
            isDisabled={isFetching || isCreatingExecution}
          >
            Cancel
          </Button>
        </footer>
      }
    >
      {isFetching ? (
        <LoadingWizardContent />
      ) : (
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
      )}
    </NewProjectWizard>
  );
};
