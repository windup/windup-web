import * as React from "react";
import {
  Tabs,
  Tab,
  TabTitleText,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import { UploadFilesForm, RuleLabelServerPathForm } from "components";

import {
  UPLOAD_RULE_TO_MIGRATION_PROJECT,
  UPLOAD_LABEL_TO_MIGRATION_PROJECT,
  getProjectConfiguration,
  updateProjectConfiguration,
} from "api/api";
import { Configuration, RulesPath, LabelsPath } from "models/api";

export interface AddRuleLabelTabsProps {
  type: "Rule" | "Label";
  projectId: number;
  onSubmitFinishedServerPath: () => void;
  onCancelServerPath: () => void;
}

export const AddRuleLabelTabs: React.FC<AddRuleLabelTabsProps> = ({
  type,
  projectId,
  onSubmitFinishedServerPath,
  onCancelServerPath,
}) => {
  const [activeTabKey, setActiveTabKey] = React.useState<number>(0);

  const handleTabClick = (_: any, tabIndex: number | string) => {
    setActiveTabKey(tabIndex as any);
  };

  const handleServerPathSubmit = (values: {
    serverPath: string;
    isChecked: boolean;
  }) => {
    getProjectConfiguration(projectId)
      .then(({ data }) => data)
      .then((configuration) => {
        const newConfiguration: Configuration = {
          ...configuration,
        };

        if (type === "Rule") {
          newConfiguration.rulesPaths = [
            ...newConfiguration.rulesPaths,
            {
              path: values.serverPath,
              scanRecursively: values.isChecked,
              rulesPathType: "USER_PROVIDED",
              registrationType: "PATH",
              scopeType: "PROJECT",
            } as RulesPath,
          ];
        } else if (type === "Label") {
          newConfiguration.labelsPaths = [
            ...newConfiguration.labelsPaths,
            {
              path: values.serverPath,
              scanRecursively: values.isChecked,
              labelsPathType: "USER_PROVIDED",
              registrationType: "PATH",
              scopeType: "PROJECT",
            } as LabelsPath,
          ];
        } else {
          throw Error("Unsupported type");
        }

        updateProjectConfiguration(newConfiguration).then(() =>
          onSubmitFinishedServerPath()
        );
      });
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Upload</TabTitleText>}>
            <br />
            <UploadFilesForm
              url={(type === "Rule"
                ? UPLOAD_RULE_TO_MIGRATION_PROJECT
                : UPLOAD_LABEL_TO_MIGRATION_PROJECT
              ).replace(":projectId", projectId.toString())}
              accept=".xml"
              template="minimal-inline"
              hideProgressOnSuccess={false}
            />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Server path</TabTitleText>}>
            <RuleLabelServerPathForm
              type={type}
              hideFormControls={false}
              onSubmit={handleServerPathSubmit}
              onCancel={onCancelServerPath}
            />
          </Tab>
        </Tabs>
      </StackItem>
    </Stack>
  );
};
