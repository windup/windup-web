import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  UploadFilesSection,
  UploadFilesSectionProps,
} from "../upload-files-section";

export default {
  title: "Components / UploadFilesSection",
  component: UploadFilesSection,
  argTypes: {
    onSuccess: { action: "success" },
    onError: { action: "error" },
    onCancel: { action: "cancel" },
    onRemove: { action: "remove" },
  },
  args: {},
} as Meta;

const Template: Story<UploadFilesSectionProps> = (args) => (
  <UploadFilesSection {...args} />
);

// export const Basic = Template.bind({});
// Basic.args = {
//   fileFormName: "file",
//   upload: (formData: FormData, config: any): AxiosPromise => {
//     return BackendAPIClient.post(
//       "http://www.mocky.io/v2/5e29b0b93000006500faf227",
//       formData,
//       config
//     );
//   },
// };
