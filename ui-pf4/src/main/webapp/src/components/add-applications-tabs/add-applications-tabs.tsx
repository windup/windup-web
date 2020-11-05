import React from "react";

import { Tabs, Tab, TabTitleText } from "@patternfly/react-core";

export enum AddApplicationsTabsType {
  UPLOAD_FILE = "UploadFile",
  SERVER_PATH = "ServerPath",
}

export interface AddApplicationsTabsProps {
  value: AddApplicationsTabsType;
  onChange: (selected: AddApplicationsTabsType) => void;

  uploadTabContent: any;
  serverPathTabContent: any;
}

export const AddApplicationsTabs: React.FC<AddApplicationsTabsProps> = ({
  value,
  onChange,

  uploadTabContent,
  serverPathTabContent,
}) => {
  const handleOnSelectTab = (_: any, selected: number | string) => {
    onChange(selected as AddApplicationsTabsType);
  };

  return (
    <Tabs activeKey={value} onSelect={handleOnSelectTab}>
      <Tab
        title={<TabTitleText>Upload</TabTitleText>}
        eventKey={AddApplicationsTabsType.UPLOAD_FILE}
      >
        {uploadTabContent}
      </Tab>
      <Tab
        title={<TabTitleText>Directory path</TabTitleText>}
        eventKey={AddApplicationsTabsType.SERVER_PATH}
      >
        {serverPathTabContent}
      </Tab>
    </Tabs>
  );
};
