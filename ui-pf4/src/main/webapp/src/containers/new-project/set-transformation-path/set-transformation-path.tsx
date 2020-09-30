import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  AlertActionCloseButton,
  Alert,
} from "@patternfly/react-core";

import { SelectCardGallery } from "components";

import { Paths, formatPath } from "Paths";
import { MigrationProject, AnalysisContext, AdvancedOption } from "models/api";
import {
  getProjectById,
  getAnalysisContext,
  saveAnalysisContext,
} from "api/api";

import NewProjectWizard, {
  WizardStepIds,
  LoadingWizardContent,
} from "../wizard";
import { AdvancedOptionsFieldKey } from "Constants";

interface SetTransformationPathProps
  extends RouteComponentProps<{ project: string }> {}

export const SetTransformationPath: React.FC<SetTransformationPathProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();

  const [transformationPath, setTransformationPath] = React.useState<string[]>(
    []
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

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

        const targets = analysisContextData.advancedOptions.filter(
          (f) => f.name === AdvancedOptionsFieldKey.TARGET
        );
        setTransformationPath(
          targets.length > 0 ? targets.map((f) => f.value) : ["eap7"]
        );
      })
      .catch(() => {
        setFetchError("Error while fetching migrationProject/analysisContext");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleOnNextStep = () => {
    setIsSubmitting(true);

    const body: AnalysisContext = {
      ...analysisContext!,
      advancedOptions: [
        ...analysisContext!.advancedOptions.filter((f) => f.name !== "target"),
        ...transformationPath.map(
          (f) => ({ name: "target", value: f } as AdvancedOption)
        ),
      ],
    };

    saveAnalysisContext(project!.id, body)
      .then(() => {
        push(
          formatPath(Paths.newProject_selectPackages, {
            project: project!.id,
          })
        );
      })
      .catch(() => {
        setSubmitError("Could not save data");
        setIsSubmitting(false);
      });
  };

  const handleTransformationPathChange = (values: string[]) => {
    setTransformationPath(values);
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.SET_TRANSFORMATION_PATH}
      enableNext={transformationPath.length > 0}
      disableNavigation={isFetching || isSubmitting}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      analysisContext={analysisContext}
      showErrorContent={fetchError}
    >
      {isFetching ? (
        <LoadingWizardContent />
      ) : (
        <Stack hasGutter>
          {submitError && (
            <StackItem>
              <Alert
                isLiveRegion
                variant="danger"
                title="Error"
                actionClose={
                  <AlertActionCloseButton onClose={() => setSubmitError("")} />
                }
              >
                {submitError}
              </Alert>
            </StackItem>
          )}
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Select transformation path
              </Title>
              <Text component="small">
                Select on or more transformation options in focus for the
                analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem
            style={{
              backgroundColor: "#f0f0f0",
              margin: "0px -25px",
              padding: "15px 15px",
            }}
          >
            <SelectCardGallery
              value={transformationPath}
              onChange={handleTransformationPathChange}
            />
          </StackItem>
        </Stack>
      )}
    </NewProjectWizard>
  );
};
