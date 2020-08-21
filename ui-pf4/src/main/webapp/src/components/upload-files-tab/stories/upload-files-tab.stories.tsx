import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AxiosPromise } from "axios";
import { UploadFilesTab, UploadFilesTabProps } from "../upload-files-tab";
import BackendAPIClient from "../../../api/apiClient";

export default {
  title: "Components / UploadFilesTab",
  component: UploadFilesTab,
  argTypes: {
    onUploadFileSuccess: { action: "success" },
    onUploadFileError: { action: "error" },
  },
} as Meta;

const Template: Story<UploadFilesTabProps> = (args) => (
  <UploadFilesTab {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  uploadFile: (formData: FormData, config: any): AxiosPromise => {
    return BackendAPIClient.post(
      "http://www.mocky.io/v2/5e29b0b93000006500faf227",
      formData,
      config
    );
  },
};
