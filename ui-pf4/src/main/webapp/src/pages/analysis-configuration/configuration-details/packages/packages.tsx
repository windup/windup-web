import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";

import {
  Card,
  CardBody,
  ActionGroup,
  Button,
  ButtonVariant,
  Stack,
  StackItem,
} from "@patternfly/react-core";

import {
  SelectProjectEmptyMessage,
  PackageSelection,
  PackageSelectionLoadingState,
  ConditionalRender,
  FetchErrorEmptyState,
} from "components";
import { useFetchProjectPackages } from "hooks/useFetchProjectPackages";

import { alertActions } from "store/alert";

import { formatPath, Paths, ProjectRoute } from "Paths";
import { getAlertModel } from "Constants";
import {
  arePackagesEquals,
  fullNameToPackage,
  getAxiosErrorMessage,
  getUnknownPackages,
} from "utils/modelUtils";

import {
  createProjectExecution,
  getAnalysisContext,
  saveAnalysisContext,
} from "api/api";
import { AnalysisContext } from "models/api";
import { isNullOrUndefined } from "utils/utils";

export interface PackagesProps extends RouteComponentProps<ProjectRoute> {}

export const Packages: React.FC<PackagesProps> = ({
  match,
  history: { push },
}) => {
  const dispatch = useDispatch();

  const {
    project,
    analysisContext,
    packages,
    applicationPackages,
    isFetching,
    fetchError,
    loadPackages,
  } = useFetchProjectPackages();

  const [enablePackageSelection, setEnablePackageSelection] = useState(false);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!isNullOrUndefined(match.params.project)) {
      loadPackages(match.params.project);
    }
  }, [match, loadPackages]);

  useEffect(() => {
    if (analysisContext && applicationPackages) {
      let newSelectedPackages = analysisContext.includePackages;
      if (newSelectedPackages.length === 0) {
        newSelectedPackages = getUnknownPackages(applicationPackages);
      }
      setSelectedPackages(newSelectedPackages.map((f) => f.fullName));
    }
  }, [analysisContext, applicationPackages]);

  useEffect(() => {
    if (analysisContext && analysisContext.includePackages.length > 0) {
      setEnablePackageSelection(true);
    }
  }, [analysisContext]);

  const handleOnSelectedPackagesChange = (value: string[]) => {
    if (!analysisContext || !packages) {
      return;
    }

    const packagesChanged = !arePackagesEquals(
      analysisContext.includePackages,
      fullNameToPackage(value, packages)
    );

    setDirty(packagesChanged);
    setSelectedPackages(value);
  };

  const handleOnUndo = () => {
    if (!analysisContext) {
      return;
    }

    const defaultPackages =
      analysisContext.includePackages.length > 0
        ? analysisContext.includePackages
        : getUnknownPackages(applicationPackages || []);

    setDirty(false);
    setSelectedPackages(defaultPackages.map((f) => f.fullName));
  };

  const onSubmit = (runAnalysis: boolean) => {
    if (!project || !packages) {
      return;
    }

    setIsSubmitting(true);
    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        const newAnalysisContext: AnalysisContext = {
          ...data,
          includePackages: enablePackageSelection
            ? fullNameToPackage(selectedPackages, packages)
            : [],
        };
        return saveAnalysisContext(project.id, newAnalysisContext, false);
      })
      .then(({ data }) => {
        if (runAnalysis) {
          return createProjectExecution(project.id, data);
        }
      })
      .then(() => {
        if (runAnalysis) {
          push(
            formatPath(Paths.executions, {
              project: project.id,
            })
          );
        } else {
          setIsSubmitting(false);
          setDirty(false);
          loadPackages(match.params.project);
        }
      })
      .catch((error: AxiosError) => {
        setIsSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  const onCancel = () => {
    push(
      formatPath(Paths.executions, {
        project: match.params.project,
      })
    );
  };

  const isValid = true;
  const arePrimaryButtonsDisabled =
    !isValid || !dirty || isFetching || isSubmitting;

  return (
    <ConditionalRender
      when={isNullOrUndefined(match.params.project)}
      then={<SelectProjectEmptyMessage />}
    >
      <Stack>
        <StackItem>
          <Card>
            <CardBody>
              <PackageSelection
                isDirty={dirty}
                enablePackageSelection={enablePackageSelection}
                onEnablePackageSelecionChange={(isChecked) => {
                  setEnablePackageSelection(isChecked);
                }}
                packages={packages || []}
                selectedPackages={selectedPackages}
                onSelectedPackagesChange={handleOnSelectedPackagesChange}
                onUndo={handleOnUndo}
                isFetching={isFetching}
                isFetchingPlaceholder={<PackageSelectionLoadingState />}
                fetchError={fetchError}
                fetchErrorPlaceholder={<FetchErrorEmptyState />}
              />
            </CardBody>
          </Card>
        </StackItem>
        <StackItem className="pf-c-form">
          {!fetchError && (
            <ActionGroup>
              <Button
                type="button"
                variant={ButtonVariant.primary}
                isDisabled={arePrimaryButtonsDisabled}
                onClick={() => onSubmit(false)}
                isLoading={isSubmitting ? true : undefined}
              >
                Save
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.primary}
                isDisabled={arePrimaryButtonsDisabled}
                onClick={() => onSubmit(true)}
              >
                Save and run
              </Button>
              <Button variant={ButtonVariant.link} onClick={onCancel}>
                Cancel
              </Button>
            </ActionGroup>
          )}
        </StackItem>
      </Stack>
    </ConditionalRender>
  );
};
