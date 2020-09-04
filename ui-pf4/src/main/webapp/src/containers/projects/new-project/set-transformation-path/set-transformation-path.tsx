import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";

import AppFormRenderer from "appFormRenderer";

import { SimplePageSection } from "components";
import { ProjectDetailsSchema } from "components/project-details-form/project-details-schema";
import { AddApplicationsSchema } from "components/add-applications-form/schema/add-applications-form.schema";

import { MigrationProject } from "models/api";
import { getProjectIdByName, getProjectById } from "api/api";

import { Paths } from "Paths";

import { TITLE, DESCRIPTION, newProjectWizardField } from "../shared/constants";
import { LoadingWizard } from "../shared/LoadingWizard";

interface CreateProjectProps extends RouteComponentProps<{ project: string }> {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = useState<MigrationProject>();
  const [isProjectBeingFetch, setIsProjectBeingFetch] = useState(true);

  useEffect(() => {
    getProjectById(match.params.project).then(({ data }) => {
      setProject(data);
      setIsProjectBeingFetch(false);
    });
  }, [match]);

  const createSchema = (project: MigrationProject): Schema => {
    const schema: Schema = {
      fields: [
        {
          ...newProjectWizardField,
          initialState: {
            activeStep: "step-2",
            activeStepIndex: 1,
            maxStepIndex: 2,
            prevSteps: ["step-1"],
            registeredFieldsHistory: { "step-1": ["title"] },
          },
          fields: [
            {
              title: "Details",
              name: "step-1",
              fields: [...ProjectDetailsSchema(getProjectIdByName).fields],
            },
            {
              title: "Add applications",
              name: "step-2",
              nextStep: "step-3",
              fields: [...AddApplicationsSchema(project?.id).fields],
            },
          ],
        },
      ],
    };

    return schema;
  };

  if (isProjectBeingFetch) {
    return <LoadingWizard />;
  }

  const handleSubmit = () => {
    console.log("should move to package selection");
  };

  const handleCancel = () => {
    push(Paths.projects);
  };

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
