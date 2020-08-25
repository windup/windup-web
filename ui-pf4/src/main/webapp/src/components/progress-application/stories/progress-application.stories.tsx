import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ProgressApplication,
  ProgressApplicationProps,
} from "../progress-application";

export default {
  title: "Components / ProgressApplication",
  component: ProgressApplication,
  argTypes: {
    onRemove: { action: "remove" },
  },
  args: {},
} as Meta;

const Template: Story<ProgressApplicationProps> = (args) => (
  <ProgressApplication {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  application: {
    created: new Date(),
    deleted: false,
    exploded: false,
    fileSize: 63083396,
    id: 52480,
    inputFilename: "AdministracionEfectivo.ear",
    inputPath: "/home/guest/git/AdministracionEfectivo.ear",
    lastModified: new Date(),
    registrationType: "UPLOADED",
    reportIndexPath: null,
    title: "AdministracionEfectivo.ear",
  },
};
