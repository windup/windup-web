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
import { getProjectById } from "api/api";
import { MigrationProject } from "models/api";

import NewProjectWizard from "..";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";

interface CreateProjectProps
  extends RouteComponentProps<{ project?: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = React.useState<MigrationProject>();

  const [processing, setProcessing] = React.useState(true);
  const [, setError] = React.useState<string>();

  React.useEffect(() => {
    if (match.params.project) {
      getProjectById(match.params.project)
        .then(({ data }) => {
          setProject(data);
        })
        .catch(() => {
          setError("Could not fetch migrationProject data");
        })
        .finally(() => {
          setProcessing(false);
        });
    } else {
      setProcessing(false);
    }
  }, [match]);

  const handleOnNextStep = () => {
    push(
      formatPath(Paths.newProject_review, {
        project: project?.id,
      })
    );
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.ADVANCED_OPTIONS}
      enableNext={false}
      isDisabled={processing}
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
                Advanced options
              </Title>
              <Text component="small">Specify additional options here.</Text>
            </TextContent>
          </StackItem>
          <StackItem>Implementation in process...</StackItem>
        </Stack>
      )}
    </NewProjectWizard>
  );
};
