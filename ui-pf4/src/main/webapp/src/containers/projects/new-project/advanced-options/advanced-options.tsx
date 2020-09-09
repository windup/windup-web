import React from "react";
import { RouteComponentProps } from "react-router-dom";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  Alert,
  AlertActionCloseButton,
  Button,
} from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { Paths, formatPath } from "Paths";
import {
  getProjectById,
  getAnalysisContext,
  getAdvancedConfigurationOptions,
} from "api/api";
import {
  MigrationProject,
  AnalysisContext,
  ConfigurationOption,
} from "models/api";

import NewProjectWizard from "..";
import { WizardStepIds, LoadingWizardContent } from "../new-project-wizard";
import { FormTemplateNewWizard } from "./new-project-wizard-ddf";
import { AdvancedOptionsForm } from "components";

export const buildSchema = (fields: ConfigurationOption[]): Schema => {
  const schema: Schema = {
    fields: [...fields]
      .sort((a, b) => a.priority - b.priority)
      .map((f) => {
        let component;

        switch (f.type) {
          case "java.lang.String":
            component = componentTypes.TEXT_FIELD;
            break;
          case "java.io.File":
            component = componentTypes.TEXT_FIELD;
            break;
          case "java.lang.Boolean":
            component = componentTypes.SWITCH;
            break;
          default:
            throw Error("Unsupported type " + f.type);
        }

        return {
          name: f.name,
          label: f.name,
          isRequired: f.required,
          component: component,
        };
      }),
  };

  return schema;
};

interface CreateProjectProps extends RouteComponentProps<{ project: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
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
    push(
      formatPath(Paths.newProject_review, {
        project: project?.id,
      })
    );
  };

  const fancyFormRef = React.createRef<any>();

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
          {configurationOptions && (
            <StackItem>
              <AdvancedOptionsForm
                availableOptions={configurationOptions}
                analysisContext={analysisContext}
                hideFormControls
              />
            </StackItem>
          )}
        </Stack>
      )}
    </NewProjectWizard>
  );
};
