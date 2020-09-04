import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSection, Wizard } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { SimplePageSection, LoadingStep } from "components";
import { Paths, formatPath } from "../../../Paths";
import {
  getProjectIdByName,
  deleteProvisionalProjects,
  createProject,
} from "api/api";
import { ProjectDetailsSchema } from "components/project-details-form/project-details-schema";

interface NewProjectProps extends RouteComponentProps {}

export const NewProject: React.FC<NewProjectProps> = ({
  history: { push },
}) => {
  const TITLE = "Create project";
  const DESCRIPTION = "Create a project for your applications";

  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  const schema: Schema = {
    fields: [
      {
        name: "wizard",
        component: componentTypes.WIZARD,
        title: TITLE,
        description: DESCRIPTION,
        inModal: true,
        buttonLabels: {
          submit: "Next",
        },
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
