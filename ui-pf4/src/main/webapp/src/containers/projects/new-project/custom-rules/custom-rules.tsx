import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
} from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";

import { MigrationProject } from "models/api";

import NewProjectWizard from "../";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";
import { getProjectById } from "api/api";

interface CustomRulesProps extends RouteComponentProps<{ project: string }> {}

export const CustomRules: React.FC<CustomRulesProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = React.useState<MigrationProject>();

  const [processing, setProcessing] = React.useState(true);
  const [, setError] = React.useState<string>();

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);
      })
      .catch(() => {
        setError("Could not fetch migrationProject data");
      })
      .finally(() => {
        setProcessing(false);
      });
  }, [match]);

  const handleOnNextStep = () => {
    push(
      formatPath(Paths.newProject_customLabels, {
        project: project?.id,
      })
    );
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.CUSTOM_RULES}
      enableNext={true}
      isDisabled={false}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
    >
      {processing ? (
        <LoadingWizardContent />
      ) : (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Custom rules
              </Title>
              <Text component="small">
                Upload the rules you want yo include in the analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>Custom rules</StackItem>
        </Stack>
      )}
    </NewProjectWizard>
  );
};
