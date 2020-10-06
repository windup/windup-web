import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  RuleLabelServerPathForm,
  RuleLabelServerPathFormProps,
} from "../rulelabel-server-path-form";

export default {
  title: "Forms / RuleLabelServerPathForm",
  component: RuleLabelServerPathForm,
  argTypes: {
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<RuleLabelServerPathFormProps> = (args) => (
  <RuleLabelServerPathForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  type: "Rule",
};

export const InitialValue = Template.bind({});
InitialValue.args = {
  type: "Rule",
  initialValues: {
    serverPath: "/home/guess/folder",
    isChecked: true,
  },
};

export const HideFormControls = Template.bind({});
HideFormControls.args = {
  type: "Rule",
  hideFormControls: true,
};
