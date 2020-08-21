import * as React from "react";
import { useState, useEffect } from "react";
import { AxiosPromise, AxiosError } from "axios";
import {
  Progress,
  ProgressSize,
  ProgressVariant,
} from "@patternfly/react-core";

export interface UploadFileProps {
  file: File;
  fileFormName: string;
  startUpload: boolean;
  upload: (formData: FormData, config: any) => AxiosPromise;
  onSuccess?: () => void;
  onError?: (error: AxiosError) => void;
}

export const UploadFile: React.FC<UploadFileProps> = ({
  file,
  fileFormName,
  startUpload,
  upload,
  onSuccess,
  onError,
}) => {
  const [progress, setProgress] = useState(0);
  const [isUplading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState<boolean>();

  useEffect(() => {
    if (startUpload) {
      setIsUploading(true);

      //
      const formData = new FormData();
      formData.set(fileFormName, file);

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const p = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(Math.round(p));
        },
      };

      upload(formData, config)
        .then(() => {
          setSuccess(true);
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch((error) => {
          setSuccess(false);
          if (onError) {
            onError(error);
          }
        })
        .finally(() => {
          setIsUploading(false);
        });
    }
  }, [fileFormName, file, startUpload, upload, onSuccess, onError]);

  return (
    <Progress
      title={file.name}
      size={ProgressSize.sm}
      value={progress}
      variant={
        success === true
          ? ProgressVariant.success
          : success === false
          ? ProgressVariant.danger
          : undefined
      }
      className={isUplading ? "inProgress" : ""}
    />
  );
};
