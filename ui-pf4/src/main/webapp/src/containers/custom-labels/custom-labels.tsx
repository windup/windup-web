import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AxiosError } from "axios";

import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  ToolbarGroup,
  ToolbarItem,
  Switch,
  Bullseye,
  Button,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  IRowData,
  IAction,
  ISeparator,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  TableSectionOffline,
  CustomEmptyState,
  RulelabelTitle,
} from "components";

import { useFetchProject } from "hooks/useFetchProject";
import { useFetchLabels } from "hooks/useFetchLabels/useFetchLabels";
import { useDeleteLabel } from "hooks/useDeleteLabel";
import { useShowRuleLabelDetails } from "hooks/useShowRuleLabelDetails";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { formatPath, Paths } from "Paths";
import { getAlertModel } from "Constants";
import {
  createProjectExecution,
  getAnalysisContext,
  saveAnalysisContext,
} from "api/api";
import { LabelsPath, LabelProviderEntity } from "models/api";
import {
  getAxiosErrorMessage,
  getErrorsFromLabelProviderEntity,
  getNumberOfLabelsFromLabelProviderEntity,
} from "utils/modelUtils";

import { AddRuleLabelButton } from "containers/add-rule-label-button";

const LABELPATH_FIELD = "labelPath";

const columns: ICell[] = [
  { title: "Short path", transforms: [sortable] },
  { title: "Number of labels", transforms: [] },
  { title: "Enable", transforms: [] },
];

const compareLabelPath = (
  a: LabelsPath,
  b: LabelsPath,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // Short path
      return (a.shortPath || a.path).localeCompare(b.shortPath || b.path);
    default:
      return 0;
  }
};

const filterLabelPath = (filterText: string, labelPath: LabelsPath) => {
  return (
    (labelPath.shortPath || labelPath.path)
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

interface CustomLabelsProps {
  projectId: string | number;
  skipChangeToProvisional: boolean;
}

export const CustomLabels: React.FC<CustomLabelsProps> = ({
  projectId,
  skipChangeToProvisional,
}) => {
  const history = useHistory();

  const dispatch = useDispatch();
  const deleteLabel = useDeleteLabel();
  const showRuleLabelDetails = useShowRuleLabelDetails();

  const {
    project,
    analysisContext,
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    fetchProject: loadProject,
  } = useFetchProject();

  const {
    labelsPath,
    labelProviders,
    isFetching: isFetchingLabels,
    fetchError: fetchLabelsError,
    loadLabels,
  } = useFetchLabels();

  useEffect(() => {
    loadProject(projectId);
    loadLabels(projectId);
  }, [projectId, loadProject, loadLabels]);

  // Switch checked state
  const [
    isAnalysisContextBeingSaved,
    setIsAnalysisContextBeingSaved,
  ] = useState(false);

  const [isLabelPathChecked, setIsLabelPathChecked] = useState(
    new Map<number, boolean>()
  );

  useEffect(() => {
    if (analysisContext && labelsPath) {
      const newCheckedValue = new Map<number, boolean>();
      labelsPath.forEach((item) => {
        newCheckedValue.set(
          item.id,
          !!analysisContext.labelsPaths.find((f) => f.id === item.id)
        );
      });
      setIsLabelPathChecked(newCheckedValue);
    }
  }, [analysisContext, labelsPath]);

  // Analysis

  const onRunAnalysis = () => {
    if (!project || project.provisional) {
      return;
    }

    setIsAnalysisContextBeingSaved(true);
    getAnalysisContext(project.defaultAnalysisContextId)
      .then(({ data }) => {
        return createProjectExecution(projectId, data);
      })
      .then(() => {
        history.push(
          formatPath(Paths.executions, {
            project: projectId,
          })
        );
      })
      .catch((error: AxiosError) => {
        setIsAnalysisContextBeingSaved(false);
        dispatch(
          alertActions.alert(
            getAlertModel("danger", "Error", getAxiosErrorMessage(error))
          )
        );
      });
  };

  //

  const handleLabelPathToggled = useCallback(
    (isChecked: boolean, labelPathToggled: LabelsPath) => {
      if (!project) {
        return;
      }

      setIsLabelPathChecked(
        new Map(isLabelPathChecked).set(labelPathToggled.id, isChecked)
      );
      setIsAnalysisContextBeingSaved(true);

      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          const newAnalysisContext = { ...data };

          if (isChecked) {
            newAnalysisContext.labelsPaths = [
              ...newAnalysisContext.labelsPaths,
              labelPathToggled,
            ];
          } else {
            newAnalysisContext.labelsPaths = newAnalysisContext.labelsPaths.filter(
              (f) => f.id !== labelPathToggled.id
            );
          }

          return saveAnalysisContext(
            project.id,
            newAnalysisContext,
            skipChangeToProvisional
          );
        })
        .then(() => {
          loadProject(project.id);
        })
        .catch((error: AxiosError) => {
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", getAxiosErrorMessage(error))
            )
          );
        })
        .finally(() => {
          setIsAnalysisContextBeingSaved(false);
        });
    },
    [
      project,
      isLabelPathChecked,
      skipChangeToProvisional,
      loadProject,
      dispatch,
    ]
  );

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: LabelsPath = getRowLabelPathField(rowData);
    const labelProviderEntity = labelProviders?.get(row.id) || [];
    const numberOfRules = getNumberOfLabelsFromLabelProviderEntity(
      labelProviderEntity
    );

    const viewDetailsAction: IAction = {
      title: "View details",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: LabelsPath = getRowLabelPathField(rowData);
        const labelProviderEntity = labelProviders?.get(row.id) || [];

        showRuleLabelDetails("Label", row, labelProviderEntity);
      },
    };

    return [
      ...(numberOfRules > 0 ? [viewDetailsAction] : []),
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: LabelsPath = getRowLabelPathField(rowData);
          deleteLabel(row, () => loadLabels(projectId));
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return isFetchingProject || isFetchingLabels || isAnalysisContextBeingSaved;
  };

  const getRowLabelPathField = (rowData: IRowData): LabelsPath => {
    return rowData[LABELPATH_FIELD];
  };

  const labelPathToIRow = useCallback(
    (labelPaths: LabelsPath[]): IRow[] => {
      return labelPaths.map((item) => {
        const labelProviderEntity: LabelProviderEntity[] =
          labelProviders?.get(item.id) || [];

        const numberOfLabels = getNumberOfLabelsFromLabelProviderEntity(
          labelProviderEntity
        );

        const errors = getErrorsFromLabelProviderEntity(labelProviderEntity);

        return {
          [LABELPATH_FIELD]: item,
          cells: [
            {
              title: (
                <RulelabelTitle
                  type="Label"
                  name={item.shortPath || item.path}
                  errors={errors}
                  numberOfRulesLabels={numberOfLabels}
                />
              ),
            },
            {
              title: numberOfLabels,
            },
            {
              title: (
                <Switch
                  aria-label={
                    isLabelPathChecked.get(item.id) ? "Enabled" : "Disabled"
                  }
                  isChecked={isLabelPathChecked.get(item.id)}
                  onChange={(isChecked) =>
                    handleLabelPathToggled(isChecked, item)
                  }
                  isDisabled={
                    isFetchingProject ||
                    isFetchingLabels ||
                    isAnalysisContextBeingSaved ||
                    errors.length > 0 ||
                    numberOfLabels === 0
                  }
                />
              ),
            },
          ],
        };
      });
    },
    [
      labelProviders,
      isAnalysisContextBeingSaved,
      isFetchingProject,
      isFetchingLabels,
      isLabelPathChecked,
      handleLabelPathToggled,
    ]
  );

  const handleOnLabelLabelClose = () => {
    loadLabels(projectId);
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom labels
            </Title>
            <Text component="small">
              Upload the labels you want to include in the analysis.
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <TableSectionOffline
            filterTextPlaceholder="Filter by short path"
            items={labelsPath}
            columns={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            loadingVariant="skeleton"
            isLoadingData={isFetchingProject || isFetchingLabels}
            loadingDataError={fetchProjectError || fetchLabelsError}
            compareItem={compareLabelPath}
            filterItem={filterLabelPath}
            mapToIRow={labelPathToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <AddRuleLabelButton
                    type="Label"
                    projectId={projectId}
                    uploadToGlobal={false}
                    isDisabled={areActionsDisabled()}
                    onModalClose={handleOnLabelLabelClose}
                  />
                </ToolbarItem>
                {project && !project.provisional && (
                  <ToolbarItem>
                    <Button
                      variant="secondary"
                      onClick={onRunAnalysis}
                      isDisabled={areActionsDisabled()}
                    >
                      Run analysis
                    </Button>
                  </ToolbarItem>
                )}
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <CustomEmptyState
                  icon={CubesIcon}
                  title="No custom labels available"
                  body={
                    <p>
                      Upload a custom label by clicking on{" "}
                      <strong>Add label</strong>.
                    </p>
                  }
                />
              </Bullseye>
            }
          />
        </StackItem>
      </Stack>
    </>
  );
};
