import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { LoadingStep, LoadingStepProps } from "../loading-step";

export default {
  title: "Components / LoadingStep",
  component: LoadingStep,
  argTypes: {},
} as Meta;

const Template: Story<LoadingStepProps> = (args) => <LoadingStep {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  customText: "Loading",
};

export const OnClose = Template.bind({});
OnClose.argTypes = {
  onClose: { action: "cancel" },
};
OnClose.args = {
  customText: "Cargando",
  cancelTitle: "Cancelar",
};
