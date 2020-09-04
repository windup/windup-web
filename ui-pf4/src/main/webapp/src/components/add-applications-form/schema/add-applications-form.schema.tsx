import { Schema } from "@data-driven-forms/react-form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

import { AppComponentTypes } from "appFormRenderer";

export const AddApplicationsSchema = (projectId: number): Schema => {
  const schema: Schema = {
    fields: [
      {
        name: "applications",
        component: componentTypes.SUB_FORM,
        title: "Add applications",
        fields: [
          {
            name: "applications",
            label: "",
            helperText: "",
            component: AppComponentTypes.ADD_APPLICATIONS,
            isRequired: true,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.MIN_ITEMS,
                threshold: 1,
              },
            ],
            // Custom properties
            projectId,
          },
          {
            name: "description",
            label: "Description",
            helperText: "A short description of the project",
            component: componentTypes.TEXTAREA,
            isRequired: false,
            validate: [],
          },
        ],
      },
    ],
  };

  return schema;
};
