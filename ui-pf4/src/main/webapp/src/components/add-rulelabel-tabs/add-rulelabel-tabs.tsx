import React, { useState } from "react";
import { AxiosError } from "axios";
import { Formik, FormikHelpers } from "formik";

import {
  Tabs,
  Tab,
  TabTitleText,
  Stack,
  StackItem,
  Form,
  ActionGroup,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";

import {
  UploadFilesDropzone,
  RuleLabelServerPathForm,
  RuleLabelServerPathFormSchema,
} from "components";
import { RuleLabelServerPathFormValues } from "components/rulelabel-server-path-form/rulelabel-server-path-form";

import {
  UPLOAD_RULE_TO_MIGRATION_PROJECT,
  UPLOAD_LABEL_TO_MIGRATION_PROJECT,
  getProjectConfiguration,
  updateConfiguration,
  getGlobalConfiguration,
  UPLOAD_RULE_GLOBALLY,
  UPLOAD_LABEL_GLOBALLY,
} from "api/api";

import { Configuration, RulesPath, LabelsPath, RuleLabel } from "models/api";

export interface AddRuleLabelTabsProps {
  type: RuleLabel;
  projectId?: number | string;
  uploadToGlobal: boolean;
  onUploadClose: () => void;
  onServerPathSaved: () => void;
  onServerPathSaveError: (error: AxiosError) => void;
  onServerPathCancel: () => void;
}

const getGlobalUploadUrl = (type: RuleLabel) => {
  return type === "Rule" ? UPLOAD_RULE_GLOBALLY : UPLOAD_LABEL_GLOBALLY;
};

const getProjectUploadUrl = (type: RuleLabel, projectId: number | string) => {
  return (type === "Rule"
    ? UPLOAD_RULE_TO_MIGRATION_PROJECT
    : UPLOAD_LABEL_TO_MIGRATION_PROJECT
  ).replace(":projectId", projectId.toString());
};

export const AddRuleLabelTabs: React.FC<AddRuleLabelTabsProps> = ({
  type,
  projectId,
  uploadToGlobal,
  onUploadClose,
  onServerPathSaved,
  onServerPathSaveError,
  onServerPathCancel,
}) => {
  const allowedFiles = ".xml";
  // const allowedFiles =
  //   type === "Rule"
  //     ? [".windup.xml", ".rhamt.xml", ".mta.xml"].join(",")
  //     : [".windup.label.xml", ".rhamt.label.xml", ".mta.labe.xml"].join(",");

  const [activeTabKey, setActiveTabKey] = useState<number>(0);
  const handleTabClick = (_: any, tabIndex: number | string) => {
    setActiveTabKey(tabIndex as any);
  };

  const handleOnSubmit = (
    formValues: RuleLabelServerPathFormValues,
    { setSubmitting }: FormikHelpers<RuleLabelServerPathFormValues>
  ) => {
    const configurationPromise = uploadToGlobal
      ? getGlobalConfiguration()
      : getProjectConfiguration(projectId!);

    configurationPromise
      .then(({ data: configuration }) => {
        const newConfiguration: Configuration = {
          ...configuration,
        };

        if (type === "Rule") {
          newConfiguration.rulesPaths = [
            ...newConfiguration.rulesPaths,
            {
              path: formValues.serverPath,
              scanRecursively: formValues.isChecked,
              rulesPathType: "USER_PROVIDED",
              registrationType: "PATH",
              scopeType: "PROJECT",
            } as RulesPath,
          ];
        } else if (type === "Label") {
          newConfiguration.labelsPaths = [
            ...newConfiguration.labelsPaths,
            {
              path: formValues.serverPath,
              scanRecursively: formValues.isChecked,
              labelsPathType: "USER_PROVIDED",
              registrationType: "PATH",
              scopeType: "PROJECT",
            } as LabelsPath,
          ];
        } else {
          throw new Error("Unsupported type");
        }

        return updateConfiguration(newConfiguration);
      })
      .then(() => {
        setSubmitting(false);
        onServerPathSaved();
      })
      .catch((error: AxiosError) => {
        setSubmitting(false);
        onServerPathSaveError(error);
      });
  };

  return (
    <Stack hasGutter>
      <StackItem>
        <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title={<TabTitleText>Upload</TabTitleText>}>
            <br />
            <Form>
              <UploadFilesDropzone
                url={
                  uploadToGlobal
                    ? getGlobalUploadUrl(type)
                    : getProjectUploadUrl(type, projectId!)
                }
                accept={allowedFiles}
                template="dropdown-box"
                hideProgressOnSuccess={false}
              />
              <ActionGroup>
                <Button
                  type="button"
                  variant={ButtonVariant.primary}
                  onClick={onUploadClose}
                >
                  Close
                </Button>
              </ActionGroup>
            </Form>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Server path</TabTitleText>}>
            <Formik
              initialValues={{ serverPath: "", isChecked: false }}
              validationSchema={RuleLabelServerPathFormSchema()}
              onSubmit={handleOnSubmit}
              initialErrors={{ name: "" }}
            >
              {({
                isValid,
                isValidating,
                isSubmitting,
                handleSubmit,
                ...formik
              }) => {
                return (
                  <Form onSubmit={handleSubmit}>
                    <RuleLabelServerPathForm
                      type={type}
                      {...{
                        ...formik,
                        isValidating,
                        isSubmitting,
                        handleSubmit,
                      }}
                    />
                    <ActionGroup>
                      <Button
                        type="submit"
                        variant={ButtonVariant.primary}
                        isDisabled={isSubmitting || isValidating || !isValid}
                      >
                        Save
                      </Button>
                      <Button
                        variant={ButtonVariant.link}
                        onClick={onServerPathCancel}
                        isDisabled={isSubmitting || isValidating}
                      >
                        Cancel
                      </Button>
                    </ActionGroup>
                  </Form>
                );
              }}
            </Formik>
          </Tab>
        </Tabs>
      </StackItem>
    </Stack>
  );
};
