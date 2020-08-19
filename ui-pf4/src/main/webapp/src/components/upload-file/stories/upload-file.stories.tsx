import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import axios, { AxiosPromise } from "axios";
// import MockAdapter from "axios-mock-adapter";
import { UploadFile, UploadFileProps } from "../upload-file";
import BackendAPIClient from "../../../api/apiClient";

// This sets the mock adapter on the default instance
// const UPLOAD_PATH = "/upload";
// const mock = new MockAdapter(axios);
// mock.onPost(UPLOAD_PATH).reply(200, {});

export default {
  title: "Components / UploadFile",
  component: UploadFile,
  argTypes: {},
  args: {},
} as Meta;

const Template: Story<UploadFileProps> = (args) => <UploadFile {...args} />;

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
