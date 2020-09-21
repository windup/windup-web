import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  AdvancedOptionsForm,
  AdvancedOptionsFormProps,
} from "../advanced-options-form";

var avaiableOptions = require("./options.json");

export default {
  title: "Forms / AdvancedOptionsForm",
  component: AdvancedOptionsForm,
  argTypes: {
    onSubmit: { action: "submit" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<AdvancedOptionsFormProps> = (args) => (
  <AdvancedOptionsForm {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  availableOptions: avaiableOptions,
};

// export const InitialValue = Template.bind({});
// InitialValue.args = {
//   availableOptions: avaiableOptions,
// };

export const HideFormControls = Template.bind({});
HideFormControls.args = {
  hideFormControls: true,
};
