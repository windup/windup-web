import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { AxiosError } from "axios";
import { PageSection, Wizard } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";

import { SimplePageSection, LoadingStep } from "../../../components";
import { Paths } from "../../../Paths";
import {
  getProjectIdByName,
  getProjectById,
  uploadFileToProject,
} from "../../../api/api";
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
              fields: [
                {
                  component: AppComponentTypes.ADD_APPLICATIONS,
                  name: "applications",
                  label: "Add applications",
                  fileFormName: "file",
                  uploadFile: (formData: FormData, config: any) => {
                    return uploadFileToProject(project.id, formData, config);
                  },
                  onUploadFileError: (error: AxiosError, file: File) => {
                    addAlert({
                      variant: "danger",
                      title: error.response?.data.message,
                    });
                  },
                },
              ],
            },
          ],
        },
      ],
    };

    return schema;
  };

  const handleSubmit = (values: any) => {};

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
