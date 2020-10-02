import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { FetchError, FetchErrorProps } from "../fetch-error";

export default {
  title: "Components / FetchError",
  component: FetchError,
  argTypes: {
    onPrimaryAction: { action: "clicked" },
  },
} as Meta;

const Template: Story<FetchErrorProps> = (args) => <FetchError {...args} />;

export const Basic = Template.bind({});
