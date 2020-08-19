import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import axios, { AxiosPromise } from "axios";
import { UploadDirectory, UploadDirectoryProps } from "../upload-directory";
import BackendAPIClient from "../../../api/apiClient";

export default {
  title: "Components / UploadDirectory",
  component: UploadDirectory,
  argTypes: {},
  args: {},
} as Meta;

const Template: Story<UploadDirectoryProps> = (args) => (
  <UploadDirectory {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  file: new File(["Content of my file"], "filename"),
  fileFormName: "file",
  uploadFile: (formData: FormData, config: any): AxiosPromise => {
    return BackendAPIClient.post(
      "http://www.mocky.io/v2/5e29b0b93000006500faf227",
      formData,
      config
    );
  },
};

export const Error = Template.bind({});
Error.args = {
  file: new File(["Content of my file"], "filename"),
  fileFormName: "file",
  uploadFile: (formData: FormData, config: any): AxiosPromise => {
    return BackendAPIClient.post("http://www.mocky.io", formData, config);
  },
};
