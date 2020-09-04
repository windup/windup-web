import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { SimplePageSection } from "components";
import {
  getProjectIdByName,
  deleteProvisionalProjects,
  createProject,
} from "api/api";
import { ProjectDetailsSchema } from "components/project-details-form/project-details-schema";
import { Paths, formatPath } from "Paths";

import { TITLE, DESCRIPTION, newProjectWizardField } from "../shared/constants";
import { LoadingWizard } from "../shared/LoadingWizard";

interface CreateProjectProps extends RouteComponentProps {}

export const CreateProject: React.FC<CreateProjectProps> = ({
  history: { push },
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  const schema: Schema = {
    fields: [
      {
        ...newProjectWizardField,
        fields: [
          {
            title: "Details",
            name: "step-1",
            fields: [...ProjectDetailsSchema(getProjectIdByName).fields],
          },
        ],
      },
    ],
  };

  const handleSubmit = (values: any) => {
    setIsSubmitting(true);

    createProject(values)
      .then((project) => {
        push(
          formatPath(Paths.newProject_completition, {
            project: project.data.id,
          })
        );
      })
      .catch(() => console.log("Error while creating project"));
  };

  const handleCancel = () => {
    push(Paths.projects);
  };

  if (isSubmitting) {
    return <LoadingWizard />;
  }

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        <FormRenderer
          schema={schema}
          componentMapper={componentMapper}
          FormTemplate={(props) => (
            <FormTemplate {...props} showFormControls={false} />
          )}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </PageSection>
    </React.Fragment>
  );
};
