import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { CustomEmptyState, CustomEmptyStateProps } from "../custom-empty-state";

import { Button } from "@patternfly/react-core";
import { AdIcon } from "@patternfly/react-icons";

export default {
  title: "Components / CustomEmptyState",
  component: CustomEmptyState,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<CustomEmptyStateProps> = (args) => (
  <CustomEmptyState {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  title: "My title",
};

export const Complex = Template.bind({});
Complex.args = {
  icon: AdIcon,
  title: "My title",
  body: "This is my body",
  primaryAction: ["My action", () => {}],
  secondaryActions: [
    <Button variant="link">Multiple</Button>,
    <Button variant="link">Action Buttons</Button>,
    <Button variant="link">Can</Button>,
    <Button variant="link">Go here</Button>,
    <Button variant="link">In the secondary</Button>,
    <Button variant="link">Action area</Button>,
  ],
};
