import * as React from "react";
import { useReducer, useState } from "react";
import {
  EmptyState,
  EmptyStateBody,
  Button,
  EmptyStateVariant,
  Stack,
  StackItem,
  Tabs,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";
import { useDropzone } from "react-dropzone";
import axios, { CancelTokenSource } from "axios";

import "./upload-files-section.scss";

import { getMapKeys } from "../../utils/utils";
import { Application } from "../../models/api";
import {
  uploadFileToProject,
  deleteRegisteredApplication,
} from "../../api/api";
import { ProgressFile } from "../progress-file";
import { ProgressApplication } from "../progress-application";

const CANCEL_MESSAGE = "cancelled";

interface Upload {
  progress: number;
  isUploading: boolean;
  finishedSuccessfully?: boolean;
  uploadCancelled: boolean;
  cancelTokenSource?: CancelTokenSource;
}
const defaultUpload: Upload = {
  progress: 0,
  isUploading: false,
  finishedSuccessfully: undefined,
  uploadCancelled: false,
};

interface Status {
  uploads: Map<File, Upload>;
  uploadsResponse: Map<File, Application>;
  applications: Application[];
}
interface Action {
  type:
    | "startUpload"
    | "updateUploadProgress"
    | "cancelUpload"
    | "finishUpload"
    | "removeUpload"
    | "removeApplication";
  payload: any;
}

const reducer = (state: Status, action: Action): Status => {
  switch (action.type) {
    case "startUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          isUploading: true,
          cancelTokenSource: action.payload.cancelTokenSource,
        }),
      };
    case "updateUploadProgress":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          progress: action.payload.progress || 0,
        }),
      };
    case "cancelUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          uploadCancelled: true,
        }),
      };
    case "finishUpload":
      return {
        ...state,
        uploads: new Map(state.uploads).set(action.payload.file, {
          ...(state.uploads.get(action.payload.file) || defaultUpload),
          isUploading: false,
          finishedSuccessfully: action.payload.finishedSuccessfully,
        }),
        uploadsResponse: new Map(state.uploadsResponse).set(
          action.payload.file,
          action.payload.application
        ),
      };
    case "removeUpload":
      const newUploads = new Map(state.uploads);
      newUploads.delete(action.payload.file);
      return {
        ...state,
        uploads: newUploads,
      };
    case "removeApplication":
      return {
        ...state,
        applications: state.applications.filter(
          (f) => f !== action.payload.application
        ),
      };
    default:
      throw new Error();
  }
};

export interface UploadFilesSectionProps {
  projectId: number;
  applications?: Application[];
  onFileUploadSuccess?: (file: File, application: Application) => void;
  onFileUploadError?: (file: File, error: any) => void;
  onApplicationRemove?: (application: Application) => void;
}

export const UploadFilesSection: React.FC<UploadFilesSectionProps> = ({
  projectId,
  applications = [],
  onFileUploadSuccess,
  onFileUploadError,
  onApplicationRemove,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    uploads: new Map(),
    uploadsResponse: new Map(),
    applications: applications,
  } as Status);

  const [activeTabKey, setActiveTabKey] = useState<number | string>(0);
  const handleTabClick = (_: any, tabIndex: number | string) => {
    setActiveTabKey(tabIndex);
  };

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
            type: "updateUploadProgress",
            payload: { file, progress: Math.round(progress) },
          });
        },
        cancelToken: source.token,
      };

      dispatch({
        type: "startUpload",
        payload: { file, cancelTokenSource: source },
      });

      uploadFileToProject(projectId, formData, config)
        .then(({ data }) => {
          dispatch({
            type: "finishUpload",
            payload: { file, finishedSuccessfully: true, application: data },
          });

          if (onFileUploadSuccess) onFileUploadSuccess(file, data);
        })
        .catch((error) => {
          dispatch({
            type: "finishUpload",
            payload: {
              file,
              finishedSuccessfully: false,
              application: undefined,
            },
          });

          if (error.message !== CANCEL_MESSAGE) {
            if (onFileUploadError) onFileUploadError(file, error);
          }
        });
    }
  };

  const handleCancelUpload = (file: File, upload: Upload) => {
    upload.cancelTokenSource?.cancel(CANCEL_MESSAGE);
    dispatch({
      type: "cancelUpload",
      payload: { file },
    });
  };

  const handleRemoveUpload = (file: File, upload: Upload) => {
    const app = state.uploadsResponse.get(file);
    if (app) {
      deleteRegisteredApplication(app.id).then(() =>
        console.log("App removed")
      );

      if (onApplicationRemove) onApplicationRemove(app);
    }

    dispatch({
      type: "removeUpload",
      payload: { file },
    });
  };

  const handleRemoveApplication = (app: Application) => {
    deleteRegisteredApplication(app.id).then(() => {
      dispatch({
        type: "removeApplication",
        payload: { application: app },
      });

      if (onApplicationRemove) onApplicationRemove(app);
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
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab eventKey={0} title={<TabTitleText>Upload</TabTitleText>}>
              <div className="upload-files-section__component__tab-content">
                <EmptyState
                  variant={EmptyStateVariant.small}
                  {...getRootProps({
                    className:
                      "upload-files-section__component__dropzone dropzone",
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
            </Tab>
            <Tab
              eventKey={1}
              title={<TabTitleText>Directory path</TabTitleText>}
            >
              <div className="upload-files-section__component__tab-content">
                <p>Not implemented yet</p>
              </div>
            </Tab>
          </Tabs>
        </StackItem>
        <StackItem>
          <Stack hasGutter>
            {getMapKeys(state.uploads).map((file: File, index) => {
              const upload = state.uploads.get(file)!;
              return (
                <StackItem key={index}>
                  <ProgressFile
                    file={file}
                    progress={upload.progress}
                    isUploading={upload.isUploading}
                    finishedSuccessfully={upload.finishedSuccessfully}
                    uploadCancelled={upload.uploadCancelled}
                    onCancel={() => handleCancelUpload(file, upload)}
                    onRemove={() => handleRemoveUpload(file, upload)}
                  />
                </StackItem>
              );
            })}
            {state.applications.map((app, index) => (
              <StackItem key={index}>
                <ProgressApplication
                  application={app}
                  onRemove={() => handleRemoveApplication(app)}
                />
              </StackItem>
            ))}
          </Stack>
        </StackItem>
      </Stack>
    </React.Fragment>
  );
};
