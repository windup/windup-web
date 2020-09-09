import * as React from "react";
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

import { Application } from "models/api";
import { deleteRegisteredApplication, UPLOAD_APPLICATION_PATH } from "api/api";
import { formatBytes } from "utils/format";

export interface ProjectDetailsFormValue {
  activeTabKey?: number;
  tab0?: {
    applications: Application[];
  };
  tab1?: {
    serverPath?: string;
    isServerPathExploded?: boolean;
  };
}

export interface AddApplicationsFormProps {
  projectId: number;
  initialValues?: ProjectDetailsFormValue;
  onChange?: (values: ProjectDetailsFormValue, isValid: boolean) => void;
}

export const AddApplicationsForm: React.FC<AddApplicationsFormProps> = ({
  projectId,
  initialValues,
  onChange,
}) => {
  const [applications, setApplications] = React.useState<Application[]>(
    initialValues?.tab0?.applications || []
  );
  const [activeTabKey, setActiveTabKey] = React.useState<number>(
    initialValues?.activeTabKey || 0
  );

  const [serverPathFormValue, setServerPathFormValue] = React.useState<
    | {
        serverPath?: string;
        isExploded?: boolean;
      }
    | undefined
  >(
    initialValues?.tab1
      ? {
          serverPath: initialValues.tab1.serverPath,
          isExploded: initialValues.tab1.isServerPathExploded,
        }
      : undefined
  );
  const [isServerPathFormValid, setIsServerPathFormValid] = React.useState(
    false
  );

  React.useEffect(() => {
    if (onChange) {
      const formValue: ProjectDetailsFormValue = {
        activeTabKey: activeTabKey,
        tab0: {
          applications: applications,
        },
        tab1: {
          serverPath: serverPathFormValue?.serverPath,
          isServerPathExploded: serverPathFormValue?.isExploded,
        },
      };

      let isFormValid = false;
      if (formValue.activeTabKey === 0) {
        isFormValid = (formValue.tab0?.applications || []).length > 0;
      } else if (formValue.activeTabKey === 1) {
        isFormValid =
          ((formValue.tab1?.serverPath || "").length || -1) > 0 &&
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
  const handleUploadFilesFormChange = React.useCallback(
    (application: Application, _: File) => {
      setApplications((current) => [...current, application]);
    },
    []
  );

  const handleServerPathFormChange = React.useCallback(
    (
      formValue: {
        serverPath?: string;
        isExploded?: boolean;
      },
      isValid: boolean
    ) => {
      setServerPathFormValue(formValue);
      setIsServerPathFormValid(isValid);
    },
    []
  );

  return (
    <Stack hasGutter>
      <StackItem>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Upload</TabTitleText>}>
            <UploadFilesForm
              url={UPLOAD_APPLICATION_PATH.replace(
                ":projectId",
                projectId.toString()
              )}
              accept=".ear,.har,.jar,.rar,.sar,.war,.zip"
              hideProgressOnSuccess={true}
              onFileUploadSuccess={handleUploadFilesFormChange}
            />
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Directory path</TabTitleText>}>
            <ServerPathForm
              hideFormControls={true}
              onChange={handleServerPathFormChange}
              initialValues={
                initialValues?.tab1
                  ? {
                      serverPath: initialValues.tab1.serverPath || "",
                      isExploded:
                        initialValues.tab1.isServerPathExploded || false,
                    }
                  : undefined
              }
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
                aria-label="Action"
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
