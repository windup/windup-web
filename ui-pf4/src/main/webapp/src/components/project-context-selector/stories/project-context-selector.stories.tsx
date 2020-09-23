import * as React from "react";
import { JsIcon } from "@patternfly/react-icons";

import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ProjectContextSelector,
  ProjectContextSelectorProps,
} from "../project-context-selector";

export default {
  title: "Components / ProjectContextSelector",
  component: ProjectContextSelector,
  argTypes: {
    onSelectProject: { action: "onSelectProject" },
  },
} as Meta;

const Template: Story<ProjectContextSelectorProps> = (args) => (
  <ProjectContextSelector {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  selectedProject: {
    applicationCount: 1,
    isDeletable: true,
    activeExecutionsCount: 0,
    migrationProject: {
      id: 1,
      provisional: false,
      title: "test",
      description: "",
      created: new Date(1600687282370),
      lastModified: new Date(1600687294936),
      applications: [],

      defaultAnalysisContextId: 259,
    },
  },
  projects: [
    {
      applicationCount: 1,
      isDeletable: true,
      activeExecutionsCount: 0,
      migrationProject: {
        id: 1,
        provisional: false,
        title: "test",
        description: "",
        created: new Date(1600687282370),
        lastModified: new Date(1600687294936),
        applications: [],

        defaultAnalysisContextId: 259,
      },
    },
    {
      applicationCount: 1,
      isDeletable: true,
      activeExecutionsCount: 0,
      migrationProject: {
        id: 2,
        provisional: false,
        title: "custom project",
        description: "",
        created: new Date(1600687282370),
        lastModified: new Date(1600687294936),
        applications: [],
        defaultAnalysisContextId: 1636,
      },
    },
    {
      applicationCount: 1,
      isDeletable: true,
      activeExecutionsCount: 0,
      migrationProject: {
        id: 3,
        provisional: false,
        title: "another project",
        description: "",
        created: new Date(1600687282370),
        lastModified: new Date(1600687294936),
        applications: [],
        defaultAnalysisContextId: 6502,
      },
    },
  ],
};
