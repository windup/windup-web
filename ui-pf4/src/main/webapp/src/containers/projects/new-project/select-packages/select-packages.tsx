import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  PageSection,
  Stack,
  StackItem,
  Title,
  TitleSizes,
  WizardStep,
  TextContent,
  Text,
} from "@patternfly/react-core";

import { SimplePageSection, PackageSelectionWrapper } from "components";
import { MigrationProject, AnalysisContext, Package } from "models/api";
import { Paths, formatPath } from "Paths";

import { TITLE, DESCRIPTION } from "../shared/constants";
import {
  LoadingWizard,
  buildWizard,
  WizardStepIds,
  ErrorWizard,
} from "../shared/WizardUtils";
import {
  getProjectById,
  getAnalysisContext,
  saveAnalysisContext,
} from "api/api";

interface SelectPackagesProps
  extends RouteComponentProps<{ project: string }> {}

export const SelectPackages: React.FC<SelectPackagesProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();
  const [isProjectBeingFetched, setIsProjectBeingFetched] = React.useState(
    true
  );

  const [discoveredPackages, setDiscoveredPackages] = React.useState<
    Package[]
  >();
  const [
    includedPackagesFullName,
    setIncludedPackagesFullName,
  ] = React.useState<string[]>([]);

  const [enableNext] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showWizardError, setShowWizardError] = React.useState(false);

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);

        getAnalysisContext(projectData.defaultAnalysisContextId)
          .then(({ data: analysisContextData }) => {
            setAnalysisContext(analysisContextData);
            setIncludedPackagesFullName(
              analysisContextData.includePackages.map((f) => f.fullName)
            );
          })
          .catch(() => {
            setShowWizardError(true);
          })
          .finally(() => {
            setIsProjectBeingFetched(false);
          });
      })
      .catch(() => {
        setIsProjectBeingFetched(false);
        setShowWizardError(true);
      });
  }, [match]);

  const handleOnNextStep = () => {
    setIsSubmitting(true);

    const newIncludedPackages: Package[] = [];

    const mapPackageFullNamesToPackageObj = (
      fullNames: string[],
      array: Package[]
    ) => {
      for (let i = 0; i < array.length; i++) {
        const elem = array[i];

        const found = fullNames.some((n) => n === elem.fullName);
        if (found) {
          newIncludedPackages.push(elem);
        }

        if (newIncludedPackages.length === fullNames.length) {
          break;
        }

        if (elem.childs && elem.childs.length > 0) {
          mapPackageFullNamesToPackageObj(fullNames, elem.childs);
        }
      }
    };
    mapPackageFullNamesToPackageObj(
      includedPackagesFullName,
      discoveredPackages || []
    );

    const body: AnalysisContext = {
      ...analysisContext!,
      includePackages: newIncludedPackages,
    };

    saveAnalysisContext(project!.id, body)
      .then(() => {
        push(
          formatPath(Paths.newProject_customRules, {
            project: project?.id,
          })
        );
      })
      .catch(() => {
        setIsSubmitting(false);
        setShowWizardError(true);
      });
  };

  const handleOnClose = () => {
    push(Paths.projects);
  };

  const handleOnGoToStep = (newStep: { id?: number }) => {
    switch (newStep.id) {
      case WizardStepIds.DETAILS:
        push(
          formatPath(Paths.newProject_details, {
            project: project?.id,
          })
        );
        break;
      case WizardStepIds.ADD_APPLICATIONS:
        push(
          formatPath(Paths.newProject_addApplications, {
            project: project?.id,
          })
        );
        break;
      case WizardStepIds.SET_TRANSFORMATION_PATH:
        push(
          formatPath(Paths.newProject_setTransformationPath, {
            project: project?.id,
          })
        );
        break;
      default:
        new Error("Can not go to step id[" + newStep.id + "]");
    }
  };

  const handleOnPackageSelectionChange = (
    includedPackages: string[],
    packages: Package[]
  ) => {
    setDiscoveredPackages(packages);
    setIncludedPackagesFullName(includedPackages);
  };

  const createWizardStep = (): WizardStep => {
    return {
      id: WizardStepIds.SELECT_PACKAGES,
      name: "Select packages",
      component: (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Select packages
              </Title>
              <Text component="small">
                Select the Java packages you want to include in the analysis.
              </Text>
            </TextContent>
          </StackItem>
          <StackItem>
            {project && (
              <PackageSelectionWrapper
                applicationIds={project.applications.map((f) => f.id)}
                includedPackages={includedPackagesFullName}
                onChange={handleOnPackageSelectionChange}
              />
            )}
          </StackItem>
        </Stack>
      ),
      canJumpTo: true,
      enableNext: enableNext,
    };
  };

  if (showWizardError) {
    return <ErrorWizard onClose={handleOnClose} />;
  }

  return (
    <React.Fragment>
      <SimplePageSection title={TITLE} description={DESCRIPTION} />
      <PageSection>
        {isSubmitting || isProjectBeingFetched ? (
          <LoadingWizard />
        ) : (
          buildWizard(
            WizardStepIds.SELECT_PACKAGES,
            createWizardStep(),
            {
              onNext: handleOnNextStep,
              onClose: handleOnClose,
              onGoToStep: handleOnGoToStep,
              onBack: handleOnGoToStep,
            },
            project
          )
        )}
      </PageSection>
    </React.Fragment>
  );
};
