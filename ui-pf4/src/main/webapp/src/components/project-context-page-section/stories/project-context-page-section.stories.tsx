import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ProjectContextPageSection } from "../project-context-page-section";

export default {
  title: "Components / ProjectContextPageSection",
  component: ProjectContextPageSection,
} as Meta;

const Template: Story<{}> = (args) => (
  <ProjectContextPageSection {...args}>my content</ProjectContextPageSection>
);

export const Basic = Template.bind({});
Basic.args = {};
