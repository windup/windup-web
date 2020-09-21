import React from "react";
import { RouteComponentProps } from "react-router-dom";

import { FormikHelpers } from "formik";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  Alert,
  AlertActionCloseButton,
} from "@patternfly/react-core";

import { Paths, formatPath } from "Paths";
import {
  getProjectById,
  getAnalysisContext,
  getAdvancedConfigurationOptions,
  saveAnalysisContext,
} from "api/api";
import {
  MigrationProject,
  AnalysisContext,
  ConfigurationOption,
  AdvancedOption,
} from "models/api";

import NewProjectWizard from "..";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";
import { AdvancedOptionsForm } from "components";

interface CreateProjectProps extends RouteComponentProps<{ project: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const formRef = React.useRef<FormikHelpers<any>>();

  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();
  const [configurationOptions, setConfigurationOptions] = React.useState<
    ConfigurationOption[]
  >();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);

        return Promise.all([
          getAnalysisContext(projectData.defaultAnalysisContextId),
          getAdvancedConfigurationOptions(),
        ]);
      })
      .then(
        ([
          { data: analysisContextData },
          { data: configurationOptionsData },
        ]) => {
          setAnalysisContext(analysisContextData);
          setConfigurationOptions(configurationOptionsData);
        }
      )
      .catch(() => {
        setFetchError("Error while fetching migrationProject/analysisContext");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleOnNextStep = () => {
    if (!formRef.current) {
      throw Error("Could not find a reference to form");
    }

    formRef.current.submitForm();
  };

  const handleOnSubmit = (formValues: any) => {
    setIsSubmitting(true);

    const newAdvanceedOptions: AdvancedOption[] = [];
    Object.keys(formValues).forEach((key) => {
      const value = formValues[key];
      if (typeof value === "string" && value.trim().length > 0) {
        newAdvanceedOptions.push({ name: key, value: value } as AdvancedOption);
      } else if (typeof value === "boolean" && value === true) {
        newAdvanceedOptions.push({
          name: key,
          value: value.toString(),
        } as AdvancedOption);
      } else if (Array.isArray(value) && value.length > 0) {
        value.forEach((f) =>
          newAdvanceedOptions.push({ name: key, value: f } as AdvancedOption)
        );
      }
    });

    const body: AnalysisContext = {
      ...analysisContext!,
      advancedOptions: newAdvanceedOptions,
    };

    saveAnalysisContext(project!.id, body)
      .then(() => {
        push(
          formatPath(Paths.newProject_review, {
            project: project!.id,
          })
        );
      })
      .catch(() => {
        setSubmitError("Could not save data");
        setIsSubmitting(false);
      });
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.ADVANCED_OPTIONS}
      enableNext={true}
      disableNavigation={isFetching || isSubmitting}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
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
                Advanced options
              </Title>
              <Text component="small">Specify additional options here.</Text>
            </TextContent>
          </StackItem>
          {configurationOptions && analysisContext && (
            <StackItem>
              <AdvancedOptionsForm
                formRef={formRef}
                hideFormControls
                availableOptions={configurationOptions}
                analysisContext={analysisContext}
                onSubmit={handleOnSubmit}
              />
            </StackItem>
          )}
        </Stack>
      )}
    </NewProjectWizard>
  );
};
