import React, { useCallback, useEffect, useState } from "react";
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
import { useFetchRules } from "hooks/useFetchRules/useFetchRules";
import { useDeleteRule } from "hooks/useDeleteRule";
import { useShowRuleLabelDetails } from "hooks/useShowRuleLabelDetails";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { getAlertModel } from "Constants";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import { RulesPath, RuleProviderEntity } from "models/api";
import {
  getAxiosErrorMessage,
  getSourcesFromRuleProviderEntity,
  getTargetsFromRuleProviderEntity,
  getNumberOfRulesFromRuleProviderEntity,
  getErrorsFromRuleProviderEntity,
} from "utils/modelUtils";

import { AddRuleLabelButton } from "containers/add-rule-label-button";

const RULEPATH_FIELD = "rulePath";

const columns: ICell[] = [
  { title: "Short path", transforms: [sortable] },
  { title: "Source/Target", transforms: [] },
  { title: "Number of rules", transforms: [] },
  { title: "Enable", transforms: [] },
];

const compareRulePath = (a: RulesPath, b: RulesPath, columnIndex?: number) => {
  switch (columnIndex) {
    case 0: // Short path
      return (a.shortPath || a.path).localeCompare(b.shortPath || b.path);
    default:
      return 0;
  }
};

const filterRulePath = (filterText: string, rulePath: RulesPath) => {
  return (
    (rulePath.shortPath || rulePath.path)
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

interface CustomRulesProps {
  projectId: string | number;
  skipChangeToProvisional: boolean;
}

export const CustomRules: React.FC<CustomRulesProps> = ({
  projectId,
  skipChangeToProvisional,
}) => {
  const dispatch = useDispatch();
  const deleteRule = useDeleteRule();
  const showRuleLabelDetails = useShowRuleLabelDetails();

  const {
    project,
    analysisContext,
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    fetchProject: loadProject,
    count: projectFechCount,
  } = useFetchProject();

  const {
    rulesPath,
    ruleProviders,
    isFetching: isFetchingRules,
    fetchError: fetchRulesError,
    loadRules,
  } = useFetchRules();

  useEffect(() => {
    loadProject(projectId);
    loadRules(projectId);
  }, [projectId, loadProject, loadRules]);

  // Switch checked state
  const [
    isAnalysisContextBeingSaved,
    setIsAnalysisContextBeingSaved,
  ] = useState(false);

  const [isRulePathChecked, setIsRulePathChecked] = useState(
    new Map<number, boolean>()
  );

  useEffect(() => {
    if (analysisContext && rulesPath) {
      const newCheckedValue = new Map<number, boolean>();
      rulesPath.forEach((item) => {
        newCheckedValue.set(
          item.id,
          !!analysisContext.rulesPaths.find((f) => f.id === item.id)
        );
      });
      setIsRulePathChecked(newCheckedValue);
    }
  }, [analysisContext, rulesPath]);

  //

  const handleRulePathToggled = useCallback(
    (isChecked: boolean, rulePathToggled: RulesPath) => {
      if (!project) {
        return;
      }

      setIsRulePathChecked(
        new Map(isRulePathChecked).set(rulePathToggled.id, isChecked)
      );
      setIsAnalysisContextBeingSaved(true);

      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          const newAnalysisContext = { ...data };

          if (isChecked) {
            newAnalysisContext.rulesPaths = [
              ...newAnalysisContext.rulesPaths,
              rulePathToggled,
            ];
          } else {
            newAnalysisContext.rulesPaths = newAnalysisContext.rulesPaths.filter(
              (f) => f.id !== rulePathToggled.id
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
    [project, isRulePathChecked, skipChangeToProvisional, loadProject, dispatch]
  );

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: RulesPath = getRowRulePathField(rowData);
    const ruleProviderEntity = ruleProviders?.get(row.id) || [];
    const numberOfRules = getNumberOfRulesFromRuleProviderEntity(
      ruleProviderEntity
    );

    const viewDetailsAction: IAction = {
      title: "View details",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: RulesPath = getRowRulePathField(rowData);
        const ruleProviderEntity = ruleProviders?.get(row.id) || [];

        showRuleLabelDetails("Rule", row, ruleProviderEntity);
      },
    };

    return [
      ...(numberOfRules > 0 ? [viewDetailsAction] : []),
      {
        title: "Delete",
        onClick: (_, rowIndex: number, rowData: IRowData) => {
          const row: RulesPath = getRowRulePathField(rowData);
          deleteRule(row, () => loadRules(projectId));
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return isFetchingProject || isFetchingRules || isAnalysisContextBeingSaved;
  };

  const getRowRulePathField = (rowData: IRowData): RulesPath => {
    return rowData[RULEPATH_FIELD];
  };

  const rulePathToIRow = useCallback(
    (rulePaths: RulesPath[]): IRow[] => {
      return rulePaths.map((item) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders?.get(item.id) || [];

        const sources = getSourcesFromRuleProviderEntity(ruleProviderEntity);
        const targets = getTargetsFromRuleProviderEntity(ruleProviderEntity);

        const numberOfRules = getNumberOfRulesFromRuleProviderEntity(
          ruleProviderEntity
        );
        const errors = getErrorsFromRuleProviderEntity(ruleProviderEntity);

        return {
          [RULEPATH_FIELD]: item,
          cells: [
            {
              title: (
                <RulelabelTitle
                  type="Rule"
                  name={item.shortPath || item.path}
                  errors={errors}
                  numberOfRulesLabels={numberOfRules}
                />
              ),
            },
            {
              title: `${[
                Array.from(sources.values()).join(", "),
                Array.from(targets.values()).join(", "),
              ]
                .filter((f) => f.length > 0)
                .join("/")}`,
            },
            {
              title: numberOfRules,
            },
            {
              title: (
                <Switch
                  aria-label={
                    isRulePathChecked.get(item.id) ? "Enabled" : "Disabled"
                  }
                  isChecked={isRulePathChecked.get(item.id)}
                  onChange={(isChecked) => {
                    handleRulePathToggled(isChecked, item);
                  }}
                  isDisabled={
                    isFetchingProject ||
                    isFetchingRules ||
                    isAnalysisContextBeingSaved ||
                    errors.length > 0
                  }
                />
              ),
            },
          ],
        };
      });
    },
    [
      ruleProviders,
      isAnalysisContextBeingSaved,
      isFetchingProject,
      isFetchingRules,
      isRulePathChecked,
      handleRulePathToggled,
    ]
  );

  const handleOnRuleLabelClose = () => {
    loadRules(projectId);
  };

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom rules
            </Title>
            <Text component="small">
              Upload the rules you want to include in the analysis.
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <TableSectionOffline
            filterTextPlaceholder="Filter by short path"
            items={rulesPath}
            columns={columns}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            loadingVariant={
              projectFechCount <= 1 || isFetchingRules ? "skeleton" : "none"
            }
            isLoadingData={isFetchingProject || isFetchingRules}
            loadingDataError={fetchProjectError || fetchRulesError}
            compareItem={compareRulePath}
            filterItem={filterRulePath}
            mapToIRow={rulePathToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <AddRuleLabelButton
                    type="Rule"
                    projectId={projectId}
                    uploadToGlobal={false}
                    onModalClose={handleOnRuleLabelClose}
                  />
                </ToolbarItem>
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <CustomEmptyState
                  icon={CubesIcon}
                  title="No custom rules available"
                  body={
                    <p>
                      Upload a custom rule by clicking on{" "}
                      <strong>Add rule</strong>.
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
