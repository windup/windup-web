import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { UploadFilesForm, UploadFilesFormProps } from "../upload-files-form";

export default {
  title: "Forms / UploadFilesForm",
  component: UploadFilesForm,
  argTypes: {
    onSuccess: { action: "success" },
    onError: { action: "error" },
    onCancel: { action: "cancel" },
    onRemove: { action: "remove" },
  },
  args: {},
} as Meta;

const Template: Story<UploadFilesFormProps> = (args) => (
  <UploadFilesForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  projectId: 1,
};
