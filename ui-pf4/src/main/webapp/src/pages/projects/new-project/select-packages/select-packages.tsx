import React, { useCallback, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AxiosError } from "axios";

import { alertActions } from "store/alert";

import { PackageSelection, PackageSelectionLoadingState } from "components";

import { useFetchProjectPackages } from "hooks/useFetchProjectPackages";

import { getAlertModel } from "Constants";
import { Paths, formatPath, ProjectRoute } from "Paths";
import { AnalysisContext, Package } from "models/api";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import {
  arePackagesEquals,
  fullNameToPackage,
  getAxiosErrorMessage,
  getUnknownPackages,
} from "utils/modelUtils";

import {
  NewProjectWizard,
  NewProjectWizardStepIds,
} from "../wizard/project-wizard";
import { useCancelWizard } from "../wizard/useCancelWizard";
import { WizardFooter } from "../wizard/project-wizard-footer";
import {
  getMaxAllowedStepToJumpTo,
  getPathFromStep,
} from "../wizard/wizard-utils";

const PACKAGES_QUERYPARAM_NAME = "packagesEstablished";

interface SelectPackagesProps extends RouteComponentProps<ProjectRoute> {}

export const SelectPackages: React.FC<SelectPackagesProps> = ({
  match,
  history,
  location,
}) => {
  const dispatch = useDispatch();
  const cancelWizard = useCancelWizard();

  const {
    project,
    analysisContext,
    packages,
    applicationPackages,
    isFetching,
    fetchError,
    loadPackages,
  } = useFetchProjectPackages();

  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dirty, setDirty] = useState(false);

  const getDefaultSelectedPackages = useCallback(
    (analysisContext: AnalysisContext, applicationPackages: Package[]) => {
      const params = new URLSearchParams(location.search);

      let result: Package[];
      if (params.get(PACKAGES_QUERYPARAM_NAME) === "true") {
        result = analysisContext.includePackages;
      } else {
        if (analysisContext.applications.some((f) => f.exploded)) {
          result = [];
        } else {
          result = getUnknownPackages(applicationPackages);
        }
      }

      return result;
    },
    [location.search]
  );

  useEffect(() => {
    loadPackages(match.params.project);
  }, [match, loadPackages]);

  useEffect(() => {
    if (analysisContext && applicationPackages) {
      const newSelectedPackages = getDefaultSelectedPackages(
        analysisContext,
        applicationPackages
      );
      setSelectedPackages(newSelectedPackages.map((f) => f.fullName));
    }
  }, [analysisContext, applicationPackages, getDefaultSelectedPackages]);

  const handleOnSelectedPackagesChange = (value: string[]) => {
    if (!analysisContext || !packages) {
      return;
    }

    const defaultSelectedPackages = getDefaultSelectedPackages(
      analysisContext,
      applicationPackages || []
    );
    const packagesChanged = !arePackagesEquals(
      defaultSelectedPackages,
      fullNameToPackage(value, packages)
    );

    setDirty(packagesChanged);
    setSelectedPackages(value);
  };

  const handleOnUndo = () => {
    if (!analysisContext) {
      return;
    }

    const defaultSelectedPackages = getDefaultSelectedPackages(
      analysisContext,
      applicationPackages || []
    );

    setDirty(false);
    setSelectedPackages(defaultSelectedPackages.map((f) => f.fullName));
  };

  const handleOnSubmit = () => {
    if (!project || !packages) {
      throw new Error("Undefined project or packages, can not handle submit");
    }

    setIsSubmitting(true);
    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        const newAnalysisContext: AnalysisContext = {
          ...data,
          includePackages: fullNameToPackage(selectedPackages, packages),
        };
        return saveAnalysisContext(project.id, newAnalysisContext, true);
      })
      .then(() => {
        const params = new URLSearchParams(location.search);
        const werePackagesEsblishedByUser =
          params.get(PACKAGES_QUERYPARAM_NAME) === "true" || dirty;

        history.push({
          pathname: formatPath(Paths.newProject_customRules, {
            project: match.params.project,
          }),
          search: `${PACKAGES_QUERYPARAM_NAME}=${werePackagesEsblishedByUser}`,
        });
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

  const handleOnGoToStep = (newStep: NewProjectWizardStepIds) => {
    history.push({
      pathname: formatPath(getPathFromStep(newStep), {
        project: match.params.project,
      }),
      search: location.search,
    });
  };

  const handleOnNext = () => {
    handleOnSubmit();
  };

  const handleOnBack = () => {
    history.push({
      pathname: formatPath(Paths.newProject_setTransformationPath, {
        project: match.params.project,
      }),
      search: location.search,
    });
  };

  const handleOnCancel = () => cancelWizard(history.push);

  const isValid = true;
  const currentStep = NewProjectWizardStepIds.SELECT_PACKAGES;
  const disableNav = isFetching || isSubmitting;
  const canJumpUpto = !isValid
    ? currentStep
    : getMaxAllowedStepToJumpTo(project, analysisContext);

  const footer = (
    <WizardFooter
      isDisabled={disableNav}
      isNextDisabled={disableNav || !isValid}
      onBack={handleOnBack}
      onNext={handleOnNext}
      onCancel={handleOnCancel}
    />
  );

  return (
    <NewProjectWizard
      disableNav={disableNav}
      stepId={currentStep}
      canJumpUpTo={canJumpUpto}
      footer={footer}
      showErrorContent={fetchError}
      onGoToStep={handleOnGoToStep}
    >
      <PackageSelection
        packages={packages || []}
        selectedPackages={selectedPackages}
        onSelectedPackagesChange={handleOnSelectedPackagesChange}
        onUndo={handleOnUndo}
        isFetching={isFetching}
        isFetchingPlaceholder={<PackageSelectionLoadingState />}
      />
    </NewProjectWizard>
  );
};
