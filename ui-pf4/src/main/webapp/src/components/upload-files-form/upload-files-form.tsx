import * as React from "react";
import { useReducer } from "react";
import {
  EmptyState,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";
import { useDropzone } from "react-dropzone";
import axios, { CancelTokenSource } from "axios";

import "./upload-files-form.scss";

import { getMapKeys } from "utils/utils";
import { Application } from "models/api";
import { uploadFileToProject } from "api/api";
import { ProgressFile } from "../progress-file";

const CANCEL_MESSAGE = "cancelled";

interface Upload {
  progress: number;
  status: "none" | "inProgress" | "complete";
  error?: any;
  wasCancelled: boolean;
  cancelToken?: CancelTokenSource;
}
const defaultUpload: Upload = {
  progress: 0,
  status: "none",
  wasCancelled: false,
};

interface Status {
  uploads: Map<File, Upload>;
  uploadsResponse: Map<File, Application>;
}
interface Action {
  type:
    | "startFileUpload"
    | "updateFileUploadProgress"
    | "successFileUpload"
    | "failFileUpload"
    | "removeFileUpload";
  payload: any;
}

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case "startFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          status: "inProgress",
          cancelToken: action.payload.cancelTokenSource,
        }),
      };
    case "updateFileUploadProgress":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          progress: action.payload.progress || 0,
        }),
      };
    case "successFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "complete",
        }),
        uploadsResponse: new Map(state.uploadsResponse).set(
          action.payload.file,
          action.payload.application
        ),
      };
    case "failFileUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...state.uploads.get(action.payload.file)!,
          status: "complete",
          error: action.payload.error,
          wasCancelled: action.payload.error.message === CANCEL_MESSAGE,
        }),
      };
    case "removeFileUpload":
      const newUploads = new Map(state.uploads);
      newUploads.delete(action.payload.file);

      const newUploadsResponse = new Map(state.uploadsResponse);
      newUploadsResponse.delete(action.payload.file);

      return {
        ...state,
        uploads: newUploads,
        uploadsResponse: newUploadsResponse,
      };
    default:
      throw new Error();
  }
};

export interface UploadFilesFormProps {
  projectId: number;
  onFileUploadSuccess?: (file: File, application: Application) => void;
  onFileUploadError?: (file: File, error: any) => void;
}

export const UploadFilesForm: React.FC<UploadFilesFormProps> = ({
  projectId,
  onFileUploadSuccess,
  onFileUploadError,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    uploads: new Map(),
    uploadsResponse: new Map(),
  } as Status);

  const handleUpload = (acceptedFiles: File[]) => {
    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index];

      // Upload
      const formData = new FormData();
      formData.set("file", file);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          dispatch({
            type: "updateFileUploadProgress",
            payload: { file, progress: Math.round(progress) },
          });
        },
        cancelToken: source.token,
      };

      dispatch({
        type: "startFileUpload",
        payload: { file, cancelTokenSource: source },
      });

      uploadFileToProject(projectId, formData, config)
        .then(({ data }) => {
          dispatch({
            type: "successFileUpload",
            payload: { file, application: data },
          });

          if (onFileUploadSuccess) onFileUploadSuccess(file, data);
        })
        .catch((error) => {
          dispatch({
            type: "failFileUpload",
            payload: { file, error },
          });

          if (error.message !== CANCEL_MESSAGE) {
            if (onFileUploadError) onFileUploadError(file, error);
          }
        });
    }
  };

  const handleCancelUpload = (file: File, upload: Upload) => {
    upload.cancelToken!.cancel(CANCEL_MESSAGE);
  };

  const handleremoveFileUpload = (file: File, upload: Upload) => {
    dispatch({
      type: "removeFileUpload",
      payload: { file },
    });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDropAccepted: handleUpload,
    accept: ".ear,.har,.jar,.rar,.sar,.war,.zip",
  });

  return (
    <React.Fragment>
      <Stack hasGutter>
        <StackItem>
          <div className="upload-files-section__component__tab-content-upload-file">
            <EmptyState
              variant={EmptyStateVariant.small}
              {...getRootProps({
                className: "upload-files-section__component__dropzone",
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
          </div>
        </StackItem>
        <StackItem>
          <Stack hasGutter>
            {getMapKeys(state.uploads)
              .filter((f) => {
                const upload = state.uploads.get(f);
                return upload?.status !== "complete" || upload.error;
              })
              .map((file: File, index) => {
                const upload = state.uploads.get(file)!;
                return (
                  <StackItem key={index}>
                    <ProgressFile
                      file={file}
                      progress={upload.progress}
                      status={upload.status}
                      error={upload.error}
                      wasCancelled={upload.wasCancelled}
                      onCancel={() => handleCancelUpload(file, upload)}
                      onRemove={() => handleremoveFileUpload(file, upload)}
                    />
                  </StackItem>
                );
              })}
          </Stack>
        </StackItem>
      </Stack>
    </React.Fragment>
  );
};
