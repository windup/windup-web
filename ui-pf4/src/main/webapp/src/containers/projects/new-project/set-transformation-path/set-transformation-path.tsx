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

import { SimplePageSection, SelectCardGallery } from "components";
import { MigrationProject, AnalysisContext } from "models/api";
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

interface SetTransformationPathProps
  extends RouteComponentProps<{ project: string }> {}

export const SetTransformationPath: React.FC<SetTransformationPathProps> = ({
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

  const [transformationPath, setTransformationPath] = React.useState<string[]>(
    []
  );

  const [enableNext, setEnableNext] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showWizardError, setShowWizardError] = React.useState(false);

  React.useEffect(() => {
    getProjectById(match.params.project)
      .then(({ data: projectData }) => {
        setProject(projectData);

        getAnalysisContext(projectData.defaultAnalysisContextId)
          .then(({ data: analysisContextData }) => {
            setAnalysisContext(analysisContextData);
            setTransformationPath(
              analysisContextData.transformationPaths.length > 0
                ? analysisContextData.transformationPaths
                : ["eap7"]
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

    const body: AnalysisContext = {
      ...analysisContext!,
      transformationPaths: transformationPath,
    };

    saveAnalysisContext(project!.id, body)
      .then(() => {
        push(Paths.projects);
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
      default:
        new Error("Can not go to step id[" + newStep.id + "]");
    }
  };

  const handleTransformationPathSelectGalleryChange = (values: string[]) => {
    setTransformationPath(values);
    setEnableNext(values.length > 0);
  };

  const createWizardStep = (): WizardStep => {
    return {
      id: WizardStepIds.SET_TRANSFORMATION_PATH,
      name: "Set transformation path",
      component: (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Title headingLevel="h5" size={TitleSizes["lg"]}>
                Select transformation path
              </Title>
              <Text component="small">
                Select on or more transformation options in focus for the
                analysis
              </Text>
            </TextContent>
          </StackItem>
          <StackItem
            style={{
              backgroundColor: "#f0f0f0",
              margin: "0px -25px",
              padding: "15px 15px",
            }}
          >
            <SelectCardGallery
              value={transformationPath}
              onChange={handleTransformationPathSelectGalleryChange}
            />
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
            WizardStepIds.SET_TRANSFORMATION_PATH,
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
