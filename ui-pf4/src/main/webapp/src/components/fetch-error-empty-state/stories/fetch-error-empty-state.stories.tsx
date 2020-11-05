import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";
import { FetchErrorEmptyState } from "../fetch-error-empty-state";
import { IRow, ICell, IActions, sortable } from "@patternfly/react-table";

export default {
  title: "Components / FetchErrorEmptyState",
  component: FetchErrorEmptyState,
  argTypes: {},
} as Meta;

const Template: Story<{}> = (args) => <FetchErrorEmptyState {...args} />;

export const Basic = Template.bind({});
