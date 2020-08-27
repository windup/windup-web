import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSection, Wizard } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

import { SimplePageSection, LoadingStep } from "../../../components";
import { Paths } from "../../../Paths";
import { getProjectIdByName, getProjectById } from "../../../api/api";
import { ProjectDetailsSchema } from "../../../components/project-details-form/project-details-schema";
import { MigrationProject } from "../../../models/api";
import AppFormRenderer, { AppComponentTypes } from "../../../appFormRenderer";

interface StateToProps {}

interface DispatchToProps {
  addAlert: (alert: any) => void;
}

interface NewProjectCompletitionProps
  extends StateToProps,
    DispatchToProps,
    RouteComponentProps<{ project: string }> {}

export const NewProjectCompletition: React.FC<NewProjectCompletitionProps> = ({
  match,
  history: { push },
  addAlert,
}) => {
  const TITLE = "Create project";
  const DESCRIPTION = "Create a project for your applications";

  const [project, setProject] = useState<MigrationProject>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProjectById(match.params.project).then(({ data }) => {
      setProject(data);
      setIsLoading(false);
    });
  }, [match]);

  const createSchema = (project: MigrationProject): Schema => {
    const schema: Schema = {
      fields: [
        {
          name: "wizard",
          component: componentTypes.WIZARD,
          title: "Create project",
          description: "Create a project for your applications",
          inModal: true,
          initialState: {
            activeStep: "step-2", // name of the active step
            activeStepIndex: 1, // active index
            maxStepIndex: 2, // max achieved index
            prevSteps: ["step-1"], // array with names of previously visited steps
            registeredFieldsHistory: { "step-1": ["title"] },
            // array of registered fields for each visited step
            // only values from registered fields will be submitted
          },
          fields: [
            {
              title: "Details",
              name: "step-1",
              nextStep: "step-2",
              fields: [...ProjectDetailsSchema(getProjectIdByName).fields],
            },
            {
              title: "Add applications",
              name: "step-2",
              nextStep: "step-3",
              fields: [
                {
                  component: AppComponentTypes.ADD_APPLICATIONS,
                  name: "applications",
                  label: "Add applications",
                  //
                  projectId: project.id,
                  onFileUploadError: (file: File, error: any) => {
                    addAlert({
                      variant: "danger",
                      title: error.response?.data.message,
                    });
                  },
                  //
                  validate: [
                    {
                      type: validatorTypes.REQUIRED,
                    },
                    {
                      type: validatorTypes.MIN_ITEMS,
                      threshold: 1,
                    },
                  ],
                },
              ],
            },
            {
              title: "Set transformation path",
              name: "step-3",
              substepOf: "Configure the analysis",
              fields: [
                {
                  component: AppComponentTypes.SELECT_TRANSFORMATION_PATH,
                  name: "transformationPath",
                  label: "Set transformation Path",
                  validate: [
                    {
                      type: validatorTypes.REQUIRED,
                    },
                    {
                      type: validatorTypes.MIN_ITEMS,
                      threshold: 1,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    return schema;
  };

  const handleSubmit = (values: any) => {
    console.log(values);
  };

  const handleCancel = () => {
    push(Paths.projects);
  };

  if (isLoading) {
    return (
      <Wizard
        isOpen={true}
        title={TITLE}
        description={DESCRIPTION}
        steps={[
          {
            name: "Loading",
            component: <LoadingStep customText="Loading" />,
            isFinishedStep: true,
          },
        ]}
      />
    );
  }

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {project && (
          <AppFormRenderer
            schema={createSchema(project)}
            initialValues={project}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </PageSection>
    </React.Fragment>
  );
};
