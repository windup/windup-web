import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { UploadFile, UploadFileProps } from "../upload-file";

export default {
  title: "Components / UploadFile",
  component: UploadFile,
  argTypes: {
    onCancel: { action: "cancel" },
    onRemove: { action: "remove" },
  },
  args: {
    file: new File(["Content of my file"], "filename.txt"),
  },
} as Meta;

const Template: Story<UploadFileProps> = (args) => <UploadFile {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  progress: 33,
  isUploading: true,
};

export const Error = Template.bind({});
Error.args = {
  progress: 80,
  isUploading: false,
  finishedSuccessfully: false,
};
