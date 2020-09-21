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
} from "@patternfly/react-core";

import { Paths } from "Paths";
import { getProjectById, getAnalysisContext } from "api/api";
import { MigrationProject, AnalysisContext } from "models/api";

import NewProjectWizard from "..";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";

interface ReviewProps extends RouteComponentProps<{ project: string }> {}

export const Review: React.FC<ReviewProps> = ({ match, history: { push } }) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

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

  const handleOnNextStep = () => {
    push(Paths.projects);
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.REVIEW}
      enableNext={true}
      disableNavigation={isFetching}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      showErrorContent={fetchError}
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
                      .filter((f) => f.name === "target")
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
