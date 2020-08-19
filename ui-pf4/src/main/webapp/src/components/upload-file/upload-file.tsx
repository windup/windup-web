import * as React from "react";
import { useState, useEffect } from "react";
import { AxiosPromise } from "axios";
import {
  Progress,
  ProgressSize,
  ProgressVariant,
} from "@patternfly/react-core";

export interface UploadFileProps {
  file: File;
  fileFormName?: string;
  uploadFile: (formData: FormData, config: any) => AxiosPromise;
}

export const UploadFile: React.FC<UploadFileProps> = ({
  file,
  fileFormName = "file",
  uploadFile,
}) => {
  const [progress, setProgress] = useState(0);
  const [, setUploading] = useState(false);
  const [success, setSuccess] = useState<boolean>();

  useEffect(() => {
    setUploading(true);

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

    uploadFile(formData, config)
      .then(() => {
        setSuccess(true);
      })
      .catch(() => {
        setSuccess(false);
      })
      .finally(() => {
        setUploading(false);
      });
  }, [fileFormName, file, uploadFile, setProgress, setUploading, setSuccess]);

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
    />
  );
};
