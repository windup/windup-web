import React, { useCallback, useEffect, useMemo } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/rootReducer";
import { alertActions } from "store/alert";
import {
  configurationOptionActions,
  configurationOptionSelector,
} from "store/configurationOptions";

import { AdvancedOptionsFieldKey, getAlertModel } from "Constants";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import {
  RulesPath,
  RuleProviderEntity,
  AdvancedOption,
  AnalysisContext,
} from "models/api";
import {
  getAxiosErrorMessage,
  getSourcesFromRuleProviderEntity,
  getTargetsFromRuleProviderEntity,
  getNumberOfRulesFromRuleProviderEntity,
  getErrorsFromRuleProviderEntity,
  getEnabledCustomSourcesAndTargets,
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
  onChange?: () => void;
}

export const CustomRules: React.FC<CustomRulesProps> = ({
  projectId,
  skipChangeToProvisional,
  onChange,
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

  /**
   * Fetch windup configurationOptions
   */

  const configurationOptions = useSelector((state: RootState) =>
    configurationOptionSelector.configurationOptions(state)
  );
  const configurationOptionsFetchStatus = useSelector((state: RootState) =>
    configurationOptionSelector.status(state)
  );
  const configurationOptionsFetchError = useSelector((state: RootState) =>
    configurationOptionSelector.error(state)
  );

  const systemProvidedSourcesAndTargets = useMemo(() => {
    const sources = configurationOptions
      ?.filter((f) => f.name === AdvancedOptionsFieldKey.SOURCE)
      .flatMap((f) => f.availableValues as string[]);
    const targets = configurationOptions
      ?.filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
      .flatMap((f) => f.availableValues as string[]);
    return sources && targets ? { sources, targets } : undefined;
  }, [configurationOptions]);

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  //

  const removeNotValidSourcesAndTargetsFromAnalysisContext = useCallback(
    (
      analysisContext: AnalysisContext,
      rulesPath: RulesPath[],
      ruleProviders: Map<number, RuleProviderEntity[]>
    ): AnalysisContext => {
      const userProvidedSourcesAndTargets = getEnabledCustomSourcesAndTargets(
        analysisContext,
        rulesPath,
        ruleProviders
      );

      return {
        ...analysisContext,
        advancedOptions: [
          ...analysisContext.advancedOptions
            .filter((f) => {
              return f.name !== AdvancedOptionsFieldKey.SOURCE;
            })
            .filter((f) => {
              return f.name !== AdvancedOptionsFieldKey.TARGET;
            }),

          ...analysisContext.advancedOptions
            .filter((f) => f.name === AdvancedOptionsFieldKey.SOURCE)
            .filter((f) => {
              return (
                systemProvidedSourcesAndTargets?.sources.indexOf(f.value) !==
                  -1 || userProvidedSourcesAndTargets.sources.has(f.value)
              );
            })
            .map((f) => {
              return {
                name: AdvancedOptionsFieldKey.SOURCE,
                value: f.value,
              } as AdvancedOption;
            }),

          ...analysisContext.advancedOptions
            .filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
            .filter((f) => {
              return (
                systemProvidedSourcesAndTargets?.targets.indexOf(f.value) !==
                  -1 || userProvidedSourcesAndTargets.targets.has(f.value)
              );
            })
            .map((f) => {
              return {
                name: AdvancedOptionsFieldKey.TARGET,
                value: f.value,
              } as AdvancedOption;
            }),
        ],
      };
    },
    [systemProvidedSourcesAndTargets]
  );

  const handleRulePathToggled = useCallback(
    (isChecked: boolean, rulePathToggled: RulesPath) => {
      if (!project || !rulesPath || !ruleProviders) {
        return;
      }

      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          let newAnalysisContext = { ...data };

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

          // Remove disabled custom sources/targets from advancedOptions
          newAnalysisContext = removeNotValidSourcesAndTargetsFromAnalysisContext(
            newAnalysisContext,
            rulesPath,
            ruleProviders
          );

          return saveAnalysisContext(
            project.id,
            newAnalysisContext,
            skipChangeToProvisional
          );
        })
        .then(() => {
          onChange && onChange();
          loadProject(project.id);
        })
        .catch((error: AxiosError) => {
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", getAxiosErrorMessage(error))
            )
          );
        });
    },
    [
      project,
      ruleProviders,
      rulesPath,
      skipChangeToProvisional,
      dispatch,
      loadProject,
      removeNotValidSourcesAndTargetsFromAnalysisContext,
      onChange,
    ]
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
          deleteRule(row, () => {
            // Remove deleted custom sources/targets from advancedOptions
            if (analysisContext && rulesPath && ruleProviders) {
              const newAnalysisContext = removeNotValidSourcesAndTargetsFromAnalysisContext(
                analysisContext,
                rulesPath,
                ruleProviders
              );

              saveAnalysisContext(
                projectId,
                newAnalysisContext,
                skipChangeToProvisional
              ).then(() => {
                onChange && onChange();
                loadRules(projectId);
              });
            }
          });
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return false;
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
                  aria-label="Enabled"
                  isChecked={
                    !!analysisContext?.rulesPaths.find((f) => f.id === item.id)
                  }
                  onChange={(isChecked) =>
                    handleRulePathToggled(isChecked, item)
                  }
                  isDisabled={errors.length > 0}
                />
              ),
            },
          ],
        };
      });
    },
    [analysisContext, ruleProviders, handleRulePathToggled]
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
            loadingVariant="skeleton"
            isLoadingData={
              isFetchingProject ||
              isFetchingRules ||
              configurationOptionsFetchStatus === "inProgress"
            }
            loadingDataError={
              fetchProjectError ||
              fetchRulesError ||
              configurationOptionsFetchError
            }
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
