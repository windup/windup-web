import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AxiosPromise } from "axios";
import { UploadFile, UploadFileProps } from "../upload-file";
import BackendAPIClient from "../../../api/apiClient";

export default {
  title: "Components / UploadFile",
  component: UploadFile,
  argTypes: {
    onSuccess: { action: "success" },
    onError: { action: "error" },
  },
  args: {
    fileFormName: "file",
    file: new File(["Content of my file"], "filename.txt"),
  },
} as Meta;

const Template: Story<UploadFileProps> = (args) => <UploadFile {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  upload: (formData: FormData, config: any): AxiosPromise => {
    return BackendAPIClient.post(
      "http://www.mocky.io/v2/5e29b0b93000006500faf227",
      formData,
      config
    );
  },
};

export const Error = Template.bind({});
Error.args = {
  upload: (formData: FormData, config: any): AxiosPromise => {
    // Will fails because wrong URL
    return BackendAPIClient.post("http://www.mocky.io", formData, config);
  },
};
