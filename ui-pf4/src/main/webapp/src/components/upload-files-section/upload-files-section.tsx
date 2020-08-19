import * as React from "react";
import { useState } from "react";
import {
  EmptyState,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Progress,
  ProgressSize,
  Stack,
  StackItem,
  ProgressVariant,
} from "@patternfly/react-core";
import { UploadIcon } from "@patternfly/react-icons";
import { useDropzone } from "react-dropzone";
import { AxiosPromise } from "axios";

import "./upload-files-section.scss";

import { Application } from "../../models/api";
import { UploadFile } from "../upload-file";

export interface UploadFilesSectionProps {
  applications?: Application[];
  fileFormName?: string;
  uploadFile: (formData: FormData, config: any) => AxiosPromise;
}

export const UploadFilesSection: React.FC<UploadFilesSectionProps> = ({
  applications,
  fileFormName = "file",
  uploadFile,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleOnDrop = (acceptedFiles: File[]) => {
    // Add new files to the beginning of the array
    setFiles((current) => [...acceptedFiles, ...current]);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: handleOnDrop,
  });

  return (
    <React.Fragment>
      <Stack hasGutter>
        <StackItem>
          <EmptyState
            variant={EmptyStateVariant.small}
            {...getRootProps({
              className: "upload-files-section__component__dropzone dropzone",
            })}
          >
            <EmptyStateIcon icon={UploadIcon} />
            <Title headingLevel="h4" size="lg">
              Upload
            </Title>
            <EmptyStateBody>
              Drag a file here or browse to upload
            </EmptyStateBody>
            <Button variant="primary" onClick={open}>
              Browser
            </Button>
            <input {...getInputProps()} />
          </EmptyState>
        </StackItem>
        <StackItem>
          <Stack hasGutter>
            {files.map((file: File, index) => (
              <StackItem key={index}>
                <UploadFile
                  file={file}
                  fileFormName={fileFormName}
                  uploadFile={uploadFile}
                />
              </StackItem>
            ))}
            {(applications || []).map((a, index) => (
              <StackItem key={index}>
                <Progress
                  title={a.inputFilename}
                  size={ProgressSize.sm}
                  value={100}
                  variant={ProgressVariant.success}
                />
              </StackItem>
            ))}
          </Stack>
        </StackItem>
      </Stack>
    </React.Fragment>
  );
};
