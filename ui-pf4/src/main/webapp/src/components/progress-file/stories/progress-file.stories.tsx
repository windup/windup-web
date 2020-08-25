import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ProgressFile, ProgressFileProps } from "../progress-file";

export default {
  title: "Components / ProgressFile",
  component: ProgressFile,
  argTypes: {
    onCancel: { action: "cancel" },
    onRemove: { action: "remove" },
  },
  args: {
    file: new File(["Content of my file"], "filename.txt"),
  },
} as Meta;

const Template: Story<ProgressFileProps> = (args) => <ProgressFile {...args} />;

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
