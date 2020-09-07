import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ServerPathForm, ServerPathFormProps } from "../server-path-form";

export default {
  title: "Forms / ServerPathForm",
  component: ServerPathForm,
  argTypes: {
    onChange: { action: "change" },
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<ServerPathFormProps> = (args) => (
  <ServerPathForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {};

export const InitialValue = Template.bind({});
InitialValue.args = {
  isInitialValuesValid: true,
  initialValues: {
    serverPath: "/home/guess/folder",
    isExploded: true,
  },
};

export const HideFormControls = Template.bind({});
HideFormControls.args = {
  hideFormControls: true,
};
