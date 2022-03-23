import React, { useCallback, useEffect, useMemo, useState } from "react";
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
    count: projectFechCount,
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

  useEffect(() => {
    if (!configurationOptions) {
      dispatch(configurationOptionActions.fetchConfigurationOptions());
    }
  }, [configurationOptions, dispatch]);

  // System provided sources and targets
  const systemProvidedSourcesAndTargets = useMemo(() => {
    const sources = configurationOptions
      ?.filter((f) => f.name === AdvancedOptionsFieldKey.SOURCE)
      .flatMap((f) => f.availableValues as string[]);
    const targets = configurationOptions
      ?.filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
      .flatMap((f) => f.availableValues as string[]);
    return sources && targets ? { sources, targets } : undefined;
  }, [configurationOptions]);

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

  const removeNotValidSourcesAndTargetsFromAnalysisContext = useCallback(
    (analysisContext: AnalysisContext): AnalysisContext => {
      const userProvidedSourcesAndTargets = getEnabledCustomSourcesAndTargets(
        analysisContext,
        rulesPath!,
        ruleProviders!
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
    [systemProvidedSourcesAndTargets, rulesPath, ruleProviders]
  );

  const handleRulePathToggled = useCallback(
    (isChecked: boolean, rulePathToggled: RulesPath) => {
      if (!project || !analysisContext || !rulesPath || !ruleProviders) {
        return;
      }

      setIsRulePathChecked(
        new Map(isRulePathChecked).set(rulePathToggled.id, isChecked)
      );
      setIsAnalysisContextBeingSaved(true);

      getAnalysisContext(project.defaultAnalysisContextId)
        .then(({ data }) => {
          let newAnalysisContext: AnalysisContext = { ...data };

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

          if (isChecked) {
            const ruleProviderEntities =
              ruleProviders.get(rulePathToggled.id) || [];

            const sources = getSourcesFromRuleProviderEntity(
              ruleProviderEntities,
              true
            );
            const targets = getTargetsFromRuleProviderEntity(
              ruleProviderEntities,
              true
            );

            newAnalysisContext.advancedOptions
              .filter((f) => f.name === AdvancedOptionsFieldKey.SOURCE)
              .forEach((f) => sources.add(f.value));
            newAnalysisContext.advancedOptions
              .filter((f) => f.name === AdvancedOptionsFieldKey.TARGET)
              .forEach((f) => targets.add(f.value));

            newAnalysisContext = {
              ...newAnalysisContext,
              advancedOptions: [
                ...newAnalysisContext.advancedOptions
                  .filter((f) => f.name !== AdvancedOptionsFieldKey.SOURCE)
                  .filter((f) => f.name !== AdvancedOptionsFieldKey.TARGET),

                ...Array.from(sources.values()).map((f) => {
                  return {
                    name: AdvancedOptionsFieldKey.SOURCE,
                    value: f,
                  } as AdvancedOption;
                }),
                ...Array.from(targets.values()).map((f) => {
                  return {
                    name: AdvancedOptionsFieldKey.TARGET,
                    value: f,
                  } as AdvancedOption;
                }),
              ],
            };
          } else {
            newAnalysisContext = removeNotValidSourcesAndTargetsFromAnalysisContext(
              { ...newAnalysisContext }
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
      analysisContext,
      ruleProviders,
      rulesPath,
      isRulePathChecked,
      skipChangeToProvisional,
      dispatch,
      loadProject,
      removeNotValidSourcesAndTargetsFromAnalysisContext,
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
            loadRules(projectId);

            // Remove deleted custom sources/targets from advancedOptions
            if (!project || !analysisContext || !rulesPath || !ruleProviders) {
              return;
            }

            setIsAnalysisContextBeingSaved(true);
            getAnalysisContext(project.defaultAnalysisContextId)
              .then(({ data }) => {
                const newAnalysisContext = removeNotValidSourcesAndTargetsFromAnalysisContext(
                  data
                );

                return saveAnalysisContext(
                  projectId,
                  newAnalysisContext,
                  skipChangeToProvisional
                );
              })
              .finally(() => {
                setIsAnalysisContextBeingSaved(false);
              });
          });
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
      isRulePathChecked,
      isFetchingRules,
      isFetchingProject,
      isAnalysisContextBeingSaved,
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
