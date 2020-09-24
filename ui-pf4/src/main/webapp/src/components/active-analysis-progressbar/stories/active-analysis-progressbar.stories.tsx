import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  ActiveAnalysisProgressbar,
  ActiveAnalysisProgressbarProps,
} from "../active-analysis-progressbar";

export default {
  title: "Components / ActiveAnalysisProgressbar",
} as Meta;

const Template: Story<ActiveAnalysisProgressbarProps> = (args) => (
  <ActiveAnalysisProgressbar {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  activeExecution: {
    id: 2,
    version: 29,
    timeQueued: 1600846566897,
    timeStarted: 1600846576805,
    timeCompleted: 1600846616614,
    outputPath: "/home/guest/data/windup/19886/reports/2",
    totalWork: 1407,
    workCompleted: 1007,
    currentTask:
      "PostFinalizePhase - DeleteWorkDirsAtTheEndRuleProvider - DeleteWorkDirsAtTheEndRuleProvider_2",
    lastModified: 1600846616614,
    state: "COMPLETED",
    filterApplications: [],
    analysisContext: {
      id: 19923,
      version: 0,
      generateStaticReports: true,
      cloudTargetsIncluded: false,
      linuxTargetsIncluded: false,
      openJdkTargetsIncluded: false,
      advancedOptions: [
        { id: 19924, version: 0, name: "target", value: "eap7" },
      ],
      rulesPaths: [],
      labelsPaths: [],
      includePackages: [],
      excludePackages: [],
      applications: [],
    },
    reportFilter: {
      id: 19925,
      selectedApplications: [],
      includeTags: [],
      excludeTags: [],
      includeCategories: [],
      excludeCategories: [],
      enabled: false,
    },
    projectId: 19886,
    outputDirectoryName: "2",
    applicationListRelativePath: "2/index.html",
    ruleProvidersExecutionOverviewRelativePath:
      "2/reports/windup_ruleproviders.html",
  },
};
