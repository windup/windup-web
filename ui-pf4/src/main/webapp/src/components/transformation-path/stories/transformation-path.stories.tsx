import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  TransformationPath,
  TransformationPathProps,
} from "../transformation-path";

export default {
  title: "Components / TransformationPath",
  component: TransformationPath,
  argTypes: {
    onSelectedTargetsChange: { action: "onSelectedTargetsChange" },
  },
} as Meta;

const Template: Story<TransformationPathProps> = (args) => (
  <TransformationPath {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  selectedTargets: ["eap7"],
};

export const IsFetching = Template.bind({});
IsFetching.args = {
  selectedTargets: ["eap7"],
  isFetching: true,
  isFetchingPlaceholder: <span>loading...</span>,
};

export const FetchError = Template.bind({});
FetchError.args = {
  selectedTargets: ["eap7"],
  fetchError: "This is my error",
  fetchErrorPlaceholder: <span>Error...</span>,
};
