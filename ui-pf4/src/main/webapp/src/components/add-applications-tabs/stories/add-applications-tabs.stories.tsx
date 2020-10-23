import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  AddApplicationsTabs,
  AddApplicationsTabsProps,
  AddApplicationsTabsType,
} from "../add-applications-tabs";

export default {
  title: "Forms / AddApplicationsTabs",
  component: AddApplicationsTabs,
  argTypes: {
    onChange: { action: "change" },
  },
} as Meta;

const Template: Story<AddApplicationsTabsProps> = (args) => (
  <AddApplicationsTabs {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  value: AddApplicationsTabsType.SERVER_PATH,
  uploadTabContent: <p>upload</p>,
  serverPathTabContent: <p>server path</p>,
};
