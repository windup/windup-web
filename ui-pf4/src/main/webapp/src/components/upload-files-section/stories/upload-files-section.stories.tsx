import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import axios, { AxiosPromise } from "axios";
// import MockAdapter from "axios-mock-adapter";
import {
  UploadFilesSection,
  UploadFilesSectionProps,
} from "../upload-files-section";
import BackendAPIClient from "../../../api/apiClient";

// This sets the mock adapter on the default instance
// const UPLOAD_PATH = "/upload";
// const mock = new MockAdapter(axios);
// mock.onPost(UPLOAD_PATH).reply(200, {});

export default {
  title: "Components / UploadFilesSection",
  component: UploadFilesSection,
  argTypes: {},
  args: {
    applications: [
      {
        id: 11108,
        created: 1597737855615,
        deleted: false,
        exploded: false,
        fileSize: 63083396,
        inputFilename: "AdministracionEfectivo.ear",
        inputPath: "/home/cferiavi/Documents/AdministracionEfectivo.ear",
        lastModified: 1597737855613,
        registrationType: "PATH",
        reportIndexPath: null,
        title: "AdministracionEfectivo.ear",
      },
      {
        id: 11111,
        created: 1597737855615,
        deleted: false,
        exploded: false,
        fileSize: 470467,
        inputFilename: "1111-1.0-SNAPSHOT.ear",
        inputPath: "/home/guest/Documents/1111-1.0-SNAPSHOT.ear",
        lastModified: 1597737855614,
        registrationType: "PATH",
        reportIndexPath: null,
        title: "1111-1.0-SNAPSHOT.ear",
      },
    ],
  },
} as Meta;

const Template: Story<UploadFilesSectionProps> = (args) => (
  <UploadFilesSection {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  fileFormName: "file",
  uploadFile: (formData: FormData, config: any): AxiosPromise => {
    return BackendAPIClient.post(
      "http://www.mocky.io/v2/5e29b0b93000006500faf227",
      formData,
      config
    );
  },
};
