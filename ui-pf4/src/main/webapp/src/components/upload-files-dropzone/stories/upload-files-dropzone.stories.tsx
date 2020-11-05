import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  UploadFilesDropzone,
  UploadFilesDropzoneProps,
} from "../upload-files-dropzone";
import { UPLOAD_APPLICATION_PATH } from "api/api";

export default {
  title: "UploadFilesDropzone",
  component: UploadFilesDropzone,
  argTypes: {
    onFileUploadSuccess: { action: "onFileUploadSuccess" },
    onFileUploadError: { action: "onFileUploadError" },
  },
  args: {},
} as Meta;

const Template: Story<UploadFilesDropzoneProps> = (args) => (
  <UploadFilesDropzone {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  url: UPLOAD_APPLICATION_PATH.replace(":projectId", "1"),
  template: "dropdown-box",
};
