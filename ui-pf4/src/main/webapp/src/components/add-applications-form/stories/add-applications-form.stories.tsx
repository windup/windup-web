import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  AddApplicationsForm,
  AddApplicationsFormProps,
} from "../add-applications-form";

export default {
  title: "Forms / AddApplicationsForm",
  component: AddApplicationsForm,
  argTypes: {
    onChange: { action: "change" },
  },
} as Meta;

const Template: Story<AddApplicationsFormProps> = (args) => (
  <AddApplicationsForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  projectId: 1,
};

export const InitialValue = Template.bind({});
InitialValue.args = {
  projectId: 1,
  initialValues: {
    tab0: {
      applications: [
        {
          id: 81227,
          registrationType: "UPLOADED",
          title: "1111-1.0-SNAPSHOT.ear",
          fileSize: 470467,
          inputPath: "/home/guest/git/1111-1.0-SNAPSHOT.ear",
          exploded: false,
          reportIndexPath: null,
          created: 1599339144153,
          lastModified: 1599339144152,
          inputFilename: "1111-1.0-SNAPSHOT.ear",
          deleted: false,
        },
        {
          id: 81229,
          registrationType: "UPLOADED",
          title: "AdministracionEfectivo.ear",
          fileSize: 63083396,
          inputPath: "/home/guest/git/AdministracionEfectivo.ear",
          exploded: false,
          reportIndexPath: null,
          created: 1599339144942,
          lastModified: 1599339144941,
          inputFilename: "AdministracionEfectivo.ear",
          deleted: false,
        },
      ],
    },
  },
};
