import React from "react";
import { RouteComponentProps } from "react-router-dom";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  AlertActionCloseButton,
  Alert,
  Button,
  Level,
  LevelItem,
  Tooltip,
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
} from "@patternfly/react-core";
import { UndoIcon, SpinnerIcon } from "@patternfly/react-icons";

import { PackageSelection } from "components";
import {
  MigrationProject,
  AnalysisContext,
  Package,
  PackageMetadata,
} from "models/api";
import { Paths, formatPath } from "Paths";

import {
  getProjectById,
  getAnalysisContext,
  saveAnalysisContext,
  getRegisteredApplicationPackages,
} from "api/api";

import NewProjectWizard from "../";
import { WizardStepIds } from "../new-project-wizard";

interface SelectPackagesProps
  extends RouteComponentProps<{ project: string }> {}

const delay = (t: number) => new Promise((resolve) => setTimeout(resolve, t));

const createWatchPromises = (appId: number): Promise<PackageMetadata> => {
  return getRegisteredApplicationPackages(appId).then(({ data }) => {
    if (data.scanStatus !== "COMPLETE") {
      return delay(1000).then(() => {
        return createWatchPromises(appId);
      });
    } else {
      return data;
    }
  });
};

const putHierarchy = (aPackage: Package) => {
  // put(aPackage);

  if (aPackage.childs) {
    aPackage.childs.forEach((child) => putHierarchy(child));
  }
};

const mergePackageHierarchy = (
  aPackage: Package,
  packageMap: Map<string, Package>,
  parentPackage: Package | undefined = undefined
) => {
  let packageInMap: Package | undefined = undefined;

  let childPackages = aPackage.childs;

  if (!packageMap.has(aPackage.fullName)) {
    packageInMap = Object.assign({}, aPackage); // clone object
    packageMap.set(aPackage.fullName, packageInMap);

    if (parentPackage) {
      parentPackage.childs.push(packageInMap);
    }

    packageInMap.childs = [];
  } else {
    // some magic
    packageInMap = packageMap.get(aPackage.fullName);
    if (packageInMap) {
      packageInMap.countClasses += aPackage.countClasses;
    }
  }

  childPackages.forEach((childPackage) => {
    mergePackageHierarchy(childPackage, packageMap, packageInMap);
  });

  return packageInMap;
};

const mergePackageRoots = (root: Package[]): Package[] => {
  let packageMap = new Map<string, Package>();
  let packageRoots = new Set<Package>();
  let result: Package[] = [];

  root.forEach((aPackage) => {
    let rootPackage = mergePackageHierarchy(aPackage, packageMap);

    if (!packageRoots.has(rootPackage!)) {
      result.push(rootPackage!);
      packageRoots.add(rootPackage!);
    }
  });

  return result;
};

const disaggregatePackages = (
  packages: Package[],
  applicationPackages: Package[],
  thirdPartyPackages: Package[]
): void => {
  for (let i = 0; i < packages.length; i++) {
    const node = packages[i];

    const newNode1 = Object.assign({}, node, { childs: [] });
    const newNode2 = Object.assign({}, node, { childs: [] });

    if (node.known) {
      // If at least one child is unknown, then the node will be part of both Arrays
      if (node.childs && node.childs.some((p) => p.known === false)) {
        applicationPackages.push(newNode1);
        thirdPartyPackages.push(newNode2);
      } else {
        thirdPartyPackages.push(newNode2);
      }
    } else {
      applicationPackages.push(newNode1);
    }

    if (node.childs) {
      disaggregatePackages(node.childs, newNode1.childs, newNode2.childs);
    }
  }
};

const getUnknownPackages = (array: Package[]) => {
  const result: Package[] = [];

  const flatternPackages = (nodes: Package[]) => {
    nodes.forEach((node) => {
      // know=false => application party package
      if (node.known === false) {
        result.push(node);
      } else {
        flatternPackages(node.childs);
      }
    });
  };
  flatternPackages(array);

  return result;
};
export const SelectPackages: React.FC<SelectPackagesProps> = ({
  match,
  history: { push },
}) => {
  const [project, setProject] = React.useState<MigrationProject>();
  const [analysisContext, setAnalysisContext] = React.useState<
    AnalysisContext
  >();

  const [packages, setPackages] = React.useState<Package[]>();
  const [includedPackages, setIncludedPackages] = React.useState<string[]>([]);

  const [applicationPackages, setApplicationPackages] = React.useState<
    Package[]
  >([]);
  const [, setThirdPartyPackages] = React.useState<Package[]>([]);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string>();

  const [isFetching, setIsFetching] = React.useState(true);
  const [fetchError, setFetchError] = React.useState<string>();

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);

        return Promise.all([
          getAnalysisContext(projectData.defaultAnalysisContextId),
          Promise.all(
            projectData.applications.map((app) => createWatchPromises(app.id))
          ),
        ]);
      })
      .then(([{ data: analysisContextData }, packageMetadataArray]) => {
        setAnalysisContext(analysisContextData);

        // Process packages
        let arrayOfRoots = ([] as any).concat(
          ...packageMetadataArray.map(
            (singlePackageMetadata) => singlePackageMetadata.packageTree
          )
        );
        let mergedRoots = mergePackageRoots(arrayOfRoots);
        mergedRoots.forEach((singleRoot) => putHierarchy(singleRoot));

        const packageTree: Package[] = mergedRoots;
        setPackages(packageTree);

        // Application packages and Third party packages
        const applicationPackages: Package[] = [];
        const thirdPartyPackages: Package[] = [];
        disaggregatePackages(
          packageTree,
          applicationPackages,
          thirdPartyPackages
        );

        setApplicationPackages(applicationPackages);
        setThirdPartyPackages(thirdPartyPackages);

        // Process included packages
        let newIncludedPackages = analysisContextData.includePackages;
        if (newIncludedPackages.length === 0) {
          newIncludedPackages = getUnknownPackages(applicationPackages);
        }
        setIncludedPackages(newIncludedPackages.map((f) => f.fullName));
      })
      .catch(() => {
        setFetchError("Could not fetch data");
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [match]);

  const handleOnNextStep = () => {
    // If packages are still being loaded no need to wait, we can jump to next step
    if (isFetching) {
      push(
        formatPath(Paths.newProject_customRules, {
          project: project?.id,
        })
      );
      return;
    }

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
    mapPackageFullNamesToPackageObj(includedPackages, packages || []);

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
        setSubmitError("Error while saving package selection");
      });
  };

  const handleOnPackageSelectionChange = (includedPackages: string[]) => {
    setIncludedPackages(includedPackages);
  };

  const handleUndo = () => {
    const newIncludedPackages = getUnknownPackages(applicationPackages);
    setIncludedPackages(newIncludedPackages.map((f) => f.fullName));
  };

  return (
    <NewProjectWizard
      stepId={WizardStepIds.SELECT_PACKAGES}
      enableNext={isFetching || includedPackages.length > 0}
      disableNavigation={isSubmitting}
      handleOnNextStep={handleOnNextStep}
      migrationProject={project}
      showErrorContent={fetchError}
    >
      <Stack hasGutter>
        {submitError && (
          <StackItem>
            <Alert
              isLiveRegion
              variant="danger"
              title="Error"
              actionClose={
                <AlertActionCloseButton onClose={() => setSubmitError("")} />
              }
            >
              {submitError}
            </Alert>
          </StackItem>
        )}
        <StackItem>
          <TextContent>
            <Level>
              <LevelItem>
                <Title headingLevel="h5" size={TitleSizes["lg"]}>
                  Select packages
                </Title>
                <Text component="small">
                  Select the Java packages you want to include in the analysis.
                </Text>
              </LevelItem>
              <LevelItem>
                <Tooltip
                  content={
                    <div>
                      Include only Application Packages to the analysis.
                    </div>
                  }
                >
                  <Button
                    variant="plain"
                    aria-label="Undo"
                    onClick={handleUndo}
                  >
                    <UndoIcon /> Undo
                  </Button>
                </Tooltip>
              </LevelItem>
            </Level>
          </TextContent>
        </StackItem>
        <StackItem>
          {isFetching ? (
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SpinnerIcon} />
                <Title headingLevel="h2" size="lg">
                  Loading packages
                </Title>
                <EmptyStateBody>
                  This process might take some time
                </EmptyStateBody>
              </EmptyState>
            </Bullseye>
          ) : (
            packages && (
              <PackageSelection
                packages={packages}
                includedPackages={includedPackages}
                onChange={handleOnPackageSelectionChange}
              />
            )
          )}
        </StackItem>
      </Stack>
    </NewProjectWizard>
  );
};
