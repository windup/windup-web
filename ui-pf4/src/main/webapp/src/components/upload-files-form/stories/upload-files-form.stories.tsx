import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { UploadFilesForm, UploadFilesFormProps } from "../upload-files-form";
import { UPLOAD_APPLICATION_PATH } from "api/api";

export default {
  title: "Forms / UploadFilesForm",
  component: UploadFilesForm,
  argTypes: {
    onFileUploadSuccess: { action: "onFileUploadSuccess" },
    onFileUploadError: { action: "onFileUploadError" },
  },
  args: {},
} as Meta;

const Template: Story<UploadFilesFormProps> = (args) => (
  <UploadFilesForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  url: UPLOAD_APPLICATION_PATH.replace(":projectId", "1"),
  template: "dropdown-box",
};
