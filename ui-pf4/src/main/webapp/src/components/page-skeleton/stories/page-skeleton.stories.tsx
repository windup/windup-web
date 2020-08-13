import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { PageSkeleton } from "../page-skeleton";

export default {
  title: "Components / PageSkeleton",
} as Meta;

const Template: Story<{}> = (args) => <PageSkeleton {...args} />;

export const Basic = Template.bind({});
Basic.args = {};
