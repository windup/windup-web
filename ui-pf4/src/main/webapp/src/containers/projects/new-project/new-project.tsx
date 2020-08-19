import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { PageSection } from "@patternfly/react-core";

import { Schema } from "@data-driven-forms/react-form-renderer";
import FormRenderer from "@data-driven-forms/react-form-renderer/dist/cjs/form-renderer";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/dist/cjs/form-template";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import componentMapper from "@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper";

import { SimplePageSection } from "../../../components";
import { Paths } from "../../../Paths";
import {
  getProjectIdByName,
  deleteProvisionalProjects,
  createProject,
} from "../../../api/api";
import { ProjectDetailsSchema } from "../../../components/project-details-form/project-details-schema";

interface NewProjectProps extends RouteComponentProps {}

export const NewProject: React.FC<NewProjectProps> = ({
  history: { push },
}) => {
  useEffect(() => {
    deleteProvisionalProjects();
  }, []);

  const schema: Schema = {
    fields: [
      {
        name: "wizard",
        component: componentTypes.WIZARD,
        title: "Create project",
        description: "Create a project for your applications",
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
    createProject(values)
      .then(() => {
        push(Paths.projects);
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    push(Paths.projects);
  };

  return (
    <React.Fragment>
      <SimplePageSection
        title="Create project"
        description="Create a project for your applications"
      />
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
