import React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  Stack,
  StackItem,
  Alert,
  AlertActionCloseButton,
  TextContent,
  Title,
  TitleSizes,
  Text,
  Card,
  CardBody,
  ActionGroup,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";

import { AppPlaceholder, SelectCardGallery } from "components";

import { formatPath, Paths } from "Paths";
import { AdvancedOptionsFieldKey } from "Constants";
import {
  createProjectExecution,
  getAnalysisContext,
  getProjectById,
  saveAnalysisContext,
} from "api/api";
import { AdvancedOption, AnalysisContext, MigrationProject } from "models/api";

export interface RulesProps extends RouteComponentProps<{ project: string }> {}

export const General: React.FC<RulesProps> = ({ match, history: { push } }) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [, setAnalysisContext] = React.useState<AnalysisContext>();

  const [isFetching, setIsFetching] = React.useState(true);
  const [, setFetchError] = React.useState<string>();

  const [transformationPath, setTransformationPath] = React.useState<string[]>(
    []
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

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
        setTransformationPath(targets.map((f) => f.value));
      })
      .catch(() => {
        setFetchError("Error while fetching migrationProject/analysisContext");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleTransformationPathChange = (values: string[]) => {
    setTransformationPath(values);
  };

  const handleOnSubmit = (runAnalysis: boolean) => {
    setIsSubmitting(true);

    getAnalysisContext(project!.defaultAnalysisContextId)
      .then(({ data: analysisContextData }) => {
        const body: AnalysisContext = {
          ...analysisContextData!,
          advancedOptions: [
            ...analysisContextData!.advancedOptions.filter(
              (f) => f.name !== "target"
            ),
            ...transformationPath.map(
              (f) => ({ name: "target", value: f } as AdvancedOption)
            ),
          ],
        };
        return saveAnalysisContext(project!.id, body);
      })
      .then(({ data: analysisContextData }) => {
        if (runAnalysis) {
          return createProjectExecution(project!.id, analysisContextData);
        }
      })
      .then(() => {
        if (runAnalysis) {
          push(
            formatPath(Paths.editProject_executionList, {
              project: project!.id,
            })
          );
        } else {
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        setSubmitError("Could not save data");
      });
  };

  const handleOnCancel = () => {
    push(
      formatPath(Paths.editProject_executionList, {
        project: project!.id,
      })
    );
  };

  return (
    <div className="pf-c-form">
      <Card>
        <CardBody>
          {isFetching ? (
            <AppPlaceholder />
          ) : (
            <Stack hasGutter>
              {submitError && (
                <StackItem>
                  <Alert
                    isLiveRegion
                    variant="danger"
                    title="Error"
                    actionClose={
                      <AlertActionCloseButton
                        onClose={() => setSubmitError("")}
                      />
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
              <StackItem>
                <SelectCardGallery
                  value={transformationPath}
                  onChange={handleTransformationPathChange}
                />
              </StackItem>
            </Stack>
          )}
        </CardBody>
      </Card>

      <ActionGroup>
        <Button
          type="button"
          variant={ButtonVariant.primary}
          isDisabled={transformationPath.length === 0 || isSubmitting}
          onClick={() => handleOnSubmit(false)}
        >
          Save
        </Button>
        <Button
          type="button"
          variant={ButtonVariant.primary}
          isDisabled={transformationPath.length === 0 || isSubmitting}
          onClick={() => handleOnSubmit(true)}
        >
          Save and run
        </Button>
        <Button variant={ButtonVariant.link} onClick={handleOnCancel}>
          Cancel
        </Button>
      </ActionGroup>
    </div>
  );
};
