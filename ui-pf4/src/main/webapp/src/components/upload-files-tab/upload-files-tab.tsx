import * as React from "react";
import { useState } from "react";
import { AxiosPromise, AxiosError } from "axios";
import { Tabs, Tab, TabTitleText } from "@patternfly/react-core";
import { UploadFilesSection } from "../upload-files-section";
import { Application } from "../../models/api";

export interface UploadFilesTabProps {
  fileFormName: string;
  applications?: Application[];
  uploadFile: (formData: FormData, config: any) => AxiosPromise;
  removeFile?: (file: File) => void;
  onUploadFileSuccess?: (response: any, file: File) => void;
  onUploadFileError?: (error: AxiosError, file: File) => void;
}

export const UploadFilesTab: React.FC<UploadFilesTabProps> = ({
  fileFormName,
  uploadFile,
  removeFile,
  onUploadFileSuccess,
  onUploadFileError,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);

  const handleTabClick = (_: any, tabIndex: number | string) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
      <Tab eventKey={0} title={<TabTitleText>Upload</TabTitleText>}>
        <br />
        <UploadFilesSection
          fileFormName={fileFormName}
          accept=".ear,.har,.jar,.rar,.sar,.war,.zip"
          upload={uploadFile}
          onRemove={removeFile}
          onSuccess={(response, file: File) => {
            if (onUploadFileSuccess) {
              onUploadFileSuccess(response, file);
            }
          }}
          onError={(error, file) => {
            if (onUploadFileError) {
              onUploadFileError(error, file);
            }
          }}
        />
      </Tab>
      <Tab eventKey={1} title={<TabTitleText>Directory path</TabTitleText>}>
        <p>Not implemented yet</p>
      </Tab>
    </Tabs>
  );
};
