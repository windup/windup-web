import React, { useCallback, useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  TabTitleText,
  Stack,
  StackItem,
  Divider,
  Split,
  SplitItem,
  Button,
  ProgressVariant,
  ButtonVariant,
  Progress,
  ProgressSize,
} from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

import { UploadFilesForm, ServerPathForm } from "components";
import { ServerPathFormValue } from "components/server-path-form/server-path-form";

import { Application } from "models/api";
import { deleteRegisteredApplication, UPLOAD_APPLICATION_PATH } from "api/api";
import { formatBytes } from "utils/format";

export enum AddApplicationsTabKey {
  UPLOAD_FILE = "UploadFile",
  SERVER_PATH = "ServerPath",
}

interface TabUploadFileValue {
  applications: Application[];
}

interface TabServerPathValue {
  serverPath: string;
  isExploded: boolean;
}

export interface AddApplicationsFormValue {
  activeTabKey?: AddApplicationsTabKey;
  tabUploadFile?: TabUploadFileValue;
  tabServerPath?: TabServerPathValue;
}

export interface AddApplicationsTabsProps {
  projectId: number;
  initialValues?: AddApplicationsFormValue;
  onChange?: (values: AddApplicationsFormValue, isValid: boolean) => void;
}

export const AddApplicationsTabs: React.FC<AddApplicationsTabsProps> = ({
  projectId,
  initialValues,
  onChange,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<AddApplicationsTabKey>(
    initialValues?.activeTabKey || AddApplicationsTabKey.UPLOAD_FILE
  );
  const [applications, setApplications] = useState<Application[]>(
    initialValues?.tabUploadFile?.applications || []
  );
  const [serverPathFormValue, setServerPathFormValue] = useState<
    TabServerPathValue
  >(
    initialValues?.tabServerPath
      ? {
          serverPath: initialValues.tabServerPath.serverPath,
          isExploded: initialValues.tabServerPath.isExploded,
        }
      : {
          serverPath: "",
          isExploded: false,
        }
  );
  const [isServerPathFormValid, setIsServerPathFormValid] = useState(false);

  useEffect(() => {
    if (onChange) {
      const formValue: AddApplicationsFormValue = {
        activeTabKey: activeTabKey,
        tabUploadFile: {
          applications: applications,
        },
        tabServerPath: {
          serverPath: serverPathFormValue?.serverPath,
          isExploded: serverPathFormValue?.isExploded,
        },
      };

      let isFormValid = false;
      if (formValue.activeTabKey === AddApplicationsTabKey.UPLOAD_FILE) {
        isFormValid = (formValue.tabUploadFile?.applications || []).length > 0;
      } else if (formValue.activeTabKey === AddApplicationsTabKey.SERVER_PATH) {
        isFormValid =
          ((formValue.tabServerPath?.serverPath || "").length || -1) > 0 &&
          isServerPathFormValid === true;
      } else {
        throw Error("Tab id not supported");
      }

      onChange(formValue, isFormValid);
    }
  }, [
    activeTabKey,
    applications,
    serverPathFormValue,
    isServerPathFormValid,
    onChange,
  ]);

  const handleTabClick = (_: any, tabIndex: number | string) => {
    setActiveTabKey(tabIndex as any);
  };

  const handleRemoveApplication = (app: Application) => {
    deleteRegisteredApplication(app.id).then(() => {
      setApplications((current) => current.filter((f) => f.id !== app.id));
    });
  };

  // Form handlers
  const handleUploadFilesFormChange = useCallback(
    (application: Application, _: File) => {
      setApplications((current) => [...current, application]);
    },
    []
  );

  const handleServerPathFormChange = useCallback(
    (formValue: ServerPathFormValue, isValid: boolean) => {
      setServerPathFormValue(formValue);
      setIsServerPathFormValid(isValid);
    },
    []
  );

  return (
    <Stack hasGutter>
      <StackItem>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab
            eventKey={AddApplicationsTabKey.UPLOAD_FILE}
            title={<TabTitleText>Upload</TabTitleText>}
          >
            <UploadFilesForm
              url={UPLOAD_APPLICATION_PATH.replace(
                ":projectId",
                projectId.toString()
              )}
              accept=".ear,.har,.jar,.rar,.sar,.war,.zip"
              template="dropdown-box"
              hideProgressOnSuccess={true}
              onFileUploadSuccess={handleUploadFilesFormChange}
            />
          </Tab>
          <Tab
            eventKey={AddApplicationsTabKey.SERVER_PATH}
            title={<TabTitleText>Directory path</TabTitleText>}
          >
            <ServerPathForm
              hideFormControls={true}
              onChange={handleServerPathFormChange}
              initialValues={serverPathFormValue}
            />
          </Tab>
        </Tabs>
      </StackItem>
      <StackItem>
        <Divider />
      </StackItem>
      {applications.map((app, index) => (
        <StackItem key={index}>
          <Split>
            <SplitItem isFilled>
              <Progress
                title={`${app.inputFilename} (${formatBytes(app.fileSize)})`}
                size={ProgressSize.sm}
                value={100}
                variant={ProgressVariant.success}
              />
            </SplitItem>
            <SplitItem>
              <Button
                variant={ButtonVariant.plain}
                aria-label="delete-application"
                onClick={() => handleRemoveApplication(app)}
              >
                <TrashIcon />
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      ))}
    </Stack>
  );
};
