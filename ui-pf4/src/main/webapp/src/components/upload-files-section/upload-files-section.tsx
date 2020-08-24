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
import axios, { AxiosPromise, AxiosError, CancelTokenSource } from "axios";

import "./upload-files-section.scss";

import { UploadFile } from "../upload-file";
import { getMapKeys } from "../../utils/utils";

const CANCEL_MESSAGE = "cancelled";

interface Upload {
  progress: number;
  isUploading: boolean;
  finishedSuccessfully?: boolean;
  uploadCancelled: boolean;
  cancelTokenSource?: CancelTokenSource;
}
interface Status {
  uploads: Map<File, Upload>;
}
interface Action {
  type:
    | "startUpload"
    | "updateProgress"
    | "cancelUpload"
    | "finishUpload"
    | "removeUpload";
  file: File;
  payload: {
    progress?: number;
    isUploading?: boolean;
    finishedSuccessfully?: boolean;
    uploadCancelled?: boolean;
    cancelTokenSource?: CancelTokenSource;
  };
}
const defaultUpload: Upload = {
  progress: 0,
  isUploading: false,
  finishedSuccessfully: undefined,
  uploadCancelled: false,
};

const reducer = (state: Status, action: Action): Status => {
  const file = action.file;
  const payload = action.payload;

  switch (action.type) {
    case "startUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(file, {
          ...(state.uploads.get(file) || defaultUpload),
          isUploading: true,
          cancelTokenSource: payload.cancelTokenSource,
        }),
      };
    case "updateProgress":
      return {
        ...state,
        uploads: new Map(state.uploads).set(file, {
          ...(state.uploads.get(file) || defaultUpload),
          progress: payload.progress || 0,
        }),
      };
    case "cancelUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(file, {
          ...(state.uploads.get(file) || defaultUpload),
          uploadCancelled: true,
        }),
      };
    case "finishUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(file, {
          ...(state.uploads.get(file) || defaultUpload),
          isUploading: false,
          finishedSuccessfully: payload.finishedSuccessfully,
        }),
      };
    case "removeUpload":
      const newUploads = new Map(state.uploads);
      newUploads.delete(file);
      return {
        ...state,
        uploads: newUploads,
      };
    default:
      throw new Error();
  }
};

export interface UploadFilesSectionProps {
  fileFormName: string;
  accept?: string | string[];
  upload: (formData: FormData, config: any) => AxiosPromise;
  onSuccess?: (response: any, file: File) => void;
  onError?: (error: AxiosError, file: File) => void;
  onCancel?: (file: File) => void;
  onRemove?: (file: File) => void;
}

export const UploadFilesSection: React.FC<UploadFilesSectionProps> = ({
  fileFormName,
  accept,
  upload,
  onError,
  onSuccess,
  onCancel,
  onRemove,
}) => {
  const [state, dispatch] = useReducer(reducer, { uploads: new Map() });

  const handleOnDrop = (acceptedFiles: File[]) => {
    for (let index = 0; index < acceptedFiles.length; index++) {
      const file = acceptedFiles[index];

      // Upload
      const formData = new FormData();
      formData.set(fileFormName, file);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      const config = {
        headers: {
          "X-Requested-With": "XMLHttpRequest",
        },
        onUploadProgress: (progressEvent: ProgressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          dispatch({
            type: "updateProgress",
            file: file,
            payload: { progress: Math.round(progress) },
          });
        },
        cancelToken: source.token,
      };

      dispatch({
        type: "startUpload",
        file: file,
        payload: { cancelTokenSource: source },
      });

      upload(formData, config)
        .then(({ data }) => {
          dispatch({
            type: "finishUpload",
            file: file,
            payload: { finishedSuccessfully: true },
          });

          if (onSuccess) {
            onSuccess(data, file);
          }
        })
        .catch((error) => {
          if (error.message === CANCEL_MESSAGE) {
            if (onCancel) {
              onCancel(file);
            }
          } else {
            if (onError) {
              onError(error, file);
            }
          }

          dispatch({
            type: "finishUpload",
            file: file,
            payload: { finishedSuccessfully: false },
          });
        });
    }
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    // onDrop: handleOnDrop,
    onDropAccepted: handleOnDrop,
    accept: accept,
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
            {getMapKeys(state.uploads).map((file: File, index) => {
              const upload = state.uploads.get(file)!;
              return (
                <StackItem key={index}>
                  <UploadFile
                    file={file}
                    progress={upload.progress}
                    isUploading={upload.isUploading}
                    finishedSuccessfully={upload.finishedSuccessfully}
                    uploadCancelled={upload.uploadCancelled}
                    onCancel={() => {
                      upload.cancelTokenSource?.cancel(CANCEL_MESSAGE);
                      dispatch({
                        type: "cancelUpload",
                        file: file,
                        payload: {},
                      });
                    }}
                    onRemove={() => {
                      dispatch({
                        type: "removeUpload",
                        file: file,
                        payload: {},
                      });

                      if (onRemove) {
                        onRemove(file);
                      }
                    }}
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
