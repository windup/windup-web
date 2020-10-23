import React, { useEffect, useState } from "react";
import { UploadFilesDropzone } from "./upload-files-dropzone";

export interface UploadFilesDropzoneWrapperProps {
  value?: any[];
  onChange: (responses: any[]) => void;

  url: string;
  accept?: string | string[];
  template: "dropdown-box" | "minimal-inline";
  allowRemove?: boolean;
  hideProgressOnSuccess?: boolean;
}

export const UploadFilesDropzoneWrapper: React.FC<UploadFilesDropzoneWrapperProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [currentValue, setCurrentValue] = useState<any[]>();

  useEffect(() => {
    if (value) {
      setCurrentValue(value);
      setUploads([]);
    }
  }, [value]);

  useEffect(() => {
    if (uploads.length > 0) {
      onChange([...(currentValue || []), ...uploads]);
    }
  }, [currentValue, uploads, onChange]);

  const handleOnUpload = (data: any) => {
    setUploads((current) => (current ? [...current, data] : [data]));
  };

  return <UploadFilesDropzone {...rest} onFileUploadSuccess={handleOnUpload} />;
};
