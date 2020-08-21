import * as React from "react";
import { useState } from "react";
import {
  EmptyState,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Progress,
  ProgressSize,
  Stack,
  StackItem,
  ProgressVariant,
} from "@patternfly/react-core";
import { useDropzone } from "react-dropzone";
import { AxiosPromise, AxiosError } from "axios";

import "./upload-files-section.scss";

import { Application } from "../../models/api";
import { UploadFile } from "../upload-file";

export interface UploadFilesSectionProps {
  applications?: Application[];
  fileFormName: string;
  upload: (formData: FormData, config: any) => AxiosPromise;
  onSuccess?: (file: File) => void;
  onError?: (error: AxiosError, file: File) => void;
}

export const UploadFilesSection: React.FC<UploadFilesSectionProps> = ({
  applications,
  fileFormName,
  upload,
  onError,
  onSuccess,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleOnDrop = (acceptedFiles: File[]) => {
    // Add new files to the beginning of the array
    setFiles((current) => [...current, ...acceptedFiles]);
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
                  startUpload={true}
                  upload={upload}
                  onSuccess={() => {
                    if (onSuccess) {
                      onSuccess(file);
                    }
                  }}
                  onError={(error) => {
                    if (onError) {
                      onError(error, file);
                    }
                  }}
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
