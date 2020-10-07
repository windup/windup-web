import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  Card,
  CardBody,
  ActionGroup,
  Button,
  ButtonVariant,
} from "@patternfly/react-core";

import {
  AppPlaceholder,
  TransformationPath,
  SelectProjectEmptyMessage,
} from "components";
import { useFetchProject } from "hooks/useFetchProject";

import { alertActions } from "store/alert";

import { formatPath, Paths, ProjectRoute } from "Paths";
import { AdvancedOptionsFieldKey, getAlertModel } from "Constants";

import {
  createProjectExecution,
  getAnalysisContext,
  saveAnalysisContext,
} from "api/api";
import { AdvancedOption, AnalysisContext } from "models/api";

export interface RulesProps extends RouteComponentProps<ProjectRoute> {}

export const General: React.FC<RulesProps> = ({ match, history: { push } }) => {
  const dispatch = useDispatch();
  const {
    project,
    analysisContext,
    isFetching,
    fetchError,
    loadProject,
  } = useFetchProject();

  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadProject(match.params.project);
  }, [match, loadProject]);

  useEffect(() => {
    if (analysisContext) {
      const targets = analysisContext.advancedOptions.filter(
        (f) => f.name === AdvancedOptionsFieldKey.TARGET
      );
      setSelectedTargets(targets.map((f) => f.value));
    }
  }, [analysisContext]);

  const handleTargetSelectionChange = (values: string[]) => {
    setSelectedTargets(values);
  };

  const onSubmit = (runAnalysis: boolean) => {
    if (!project) {
      return;
    }

    setIsSubmitting(true);
    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        const newAnalysisContext: AnalysisContext = {
          ...data,
          advancedOptions: [
            ...data.advancedOptions.filter((f) => {
              return f.name !== AdvancedOptionsFieldKey.TARGET;
            }),
            ...selectedTargets.map((f) => {
              return {
                name: AdvancedOptionsFieldKey.TARGET,
                value: f,
              } as AdvancedOption;
            }),
          ],
        };
        return saveAnalysisContext(match.params.project, newAnalysisContext);
      })
      .then(({ data }) => {
        if (runAnalysis) {
          return createProjectExecution(match.params.project, data);
        }
      })
      .then(() => {
        if (runAnalysis) {
          push(
            formatPath(Paths.executions, {
              project: match.params.project,
            })
          );
        } else {
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setIsSubmitting(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", "Could not save data")
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

  return (
    <div className="pf-c-form">
      <Card>
        <CardBody>
          <TransformationPath
            selectedTargets={selectedTargets}
            onSelectedTargetsChange={handleTargetSelectionChange}
            isFetching={isFetching}
            isFetchingPlaceholder={<AppPlaceholder />}
            fetchError={fetchError}
            fetchErrorPlaceholder={<SelectProjectEmptyMessage />}
          />
        </CardBody>
      </Card>
      {!fetchError && (
        <ActionGroup>
          <Button
            type="button"
            variant={ButtonVariant.primary}
            isDisabled={selectedTargets.length === 0 || isSubmitting}
            onClick={() => onSubmit(false)}
          >
            Save
          </Button>
          <Button
            type="button"
            variant={ButtonVariant.primary}
            isDisabled={selectedTargets.length === 0 || isSubmitting}
            onClick={() => onSubmit(true)}
          >
            Save and run
          </Button>
          <Button variant={ButtonVariant.link} onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
      )}
    </div>
  );
};
