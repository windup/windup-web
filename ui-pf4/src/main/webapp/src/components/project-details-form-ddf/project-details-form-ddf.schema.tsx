import { Schema } from "@data-driven-forms/react-form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/dist/cjs/component-types";
import validatorTypes from "@data-driven-forms/react-form-renderer/dist/cjs/validator-types";

export const ProjectDetailsSchema = (
  searchProjectByName: (name: string) => Promise<any>
): Schema => {
  const asyncNameValidator = (value: string) =>
    searchProjectByName(value)
      .then((response: any) => {
        if (response && response.data) {
          const error = { message: "The entered name is already in use" };
          throw error;
        }
      })
      .catch((error) => {
        throw error && error.message
          ? error.message
          : "There was an error validating 'name'";
      });

  const schema: Schema = {
    fields: [
      {
        name: "project",
        component: componentTypes.SUB_FORM,
        title: "Project details",
        fields: [
          {
            name: "title",
            label: "Name",
            helperText: "A unique name for the project",
            component: componentTypes.TEXT_FIELD,
            isRequired: true,
            validate: [
              asyncNameValidator,
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.MIN_LENGTH,
                threshold: 3,
              },
            ],
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
