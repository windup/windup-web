import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  Button,
  ToolbarGroup,
  ToolbarItem,
  Switch,
  Modal,
  ModalVariant,
  Bullseye,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  IActions,
  IRowData,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  AddRuleLabelTabs,
  TableSectionOffline,
  CustomEmptyState,
} from "components";

import { useFetchProject } from "hooks/useFetchProject";
import { useFetchRules } from "hooks/useFetchRules/useFetchRules";
import { useDeleteRule } from "hooks/useDeleteRule";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { getAlertModel } from "Constants";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import { RulesPath, RuleProviderEntity } from "models/api";

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
}

export const CustomRules: React.FC<CustomRulesProps> = ({ projectId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dispatch = useDispatch();
  const deleteRule = useDeleteRule();

  const {
    project,
    analysisContext,
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    loadProject,
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

  const handleRulePathToggled = useCallback(
    (isChecked: boolean, rulePathToggled: RulesPath) => {
      if (!project) {
        return;
      }

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

          return saveAnalysisContext(project.id, newAnalysisContext);
        })
        .then(() => {
          loadProject(project.id);
        })
        .catch(() => {
          dispatch(
            alertActions.alert(
              getAlertModel("danger", "Error", "Could not save data")
            )
          );
        });
    },
    [project, loadProject, dispatch]
  );

  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: RulesPath = rowData.props[RULEPATH_FIELD];
        deleteRule(row, () => loadRules(projectId));
      },
    },
  ];

  const rulePathToIRow = useCallback(
    (rulePaths: RulesPath[]): IRow[] => {
      return rulePaths.map((item) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders?.get(item) || [];

        const sources = ruleProviderEntity.reduce((collection, element) => {
          element.sources.forEach((f) => {
            collection.add(`${f.name}:${f.versionRange}`);
          });
          return collection;
        }, new Set<string>());
        const targets = ruleProviderEntity.reduce((collection, element) => {
          element.targets.forEach((f) => {
            collection.add(`${f.name}:${f.versionRange}`);
          });
          return collection;
        }, new Set<string>());

        const numberOfRules: number = ruleProviderEntity.reduce(
          (counter, element) => counter + element.rules.length,
          0
        );

        return {
          props: {
            [RULEPATH_FIELD]: item,
          },
          cells: [
            {
              title: item.shortPath || item.path,
            },
            {
              title: `${Array.from(sources.values())}/${Array.from(
                targets.values()
              )}`,
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
                />
              ),
            },
          ],
        };
      });
    },
    [analysisContext, ruleProviders, handleRulePathToggled]
  );

  const handleModalToggle = () => {
    setIsModalOpen((current) => {
      if (current) {
        loadRules(projectId);
      }
      return !current;
    });
  };

  const handleOnRuleLabelClose = () => {
    setIsModalOpen((current) => !current);
    loadRules(projectId);
  };

  return (
    <>
      <Modal
        variant={ModalVariant.medium}
        title="Add rules"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <AddRuleLabelTabs
          type="Rule"
          projectId={projectId}
          onSubmitFinishedServerPath={handleOnRuleLabelClose}
          onCancelServerPath={handleOnRuleLabelClose}
        />
      </Modal>

      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom rules
            </Title>
            <Text component="small">
              Upload the rules you want yo include in the analysis
            </Text>
          </TextContent>
        </StackItem>
        <StackItem>
          <TableSectionOffline
            items={rulesPath || []}
            columns={columns}
            actions={actions}
            loadingVariant="skeleton"
            isLoadingData={isFetchingProject || isFetchingRules}
            loadingDataError={fetchProjectError || fetchRulesError}
            compareItem={compareRulePath}
            filterItem={filterRulePath}
            mapToIRow={rulePathToIRow}
            toolbar={
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button type="button" onClick={handleModalToggle}>
                    Add rule
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
            }
            emptyState={
              <Bullseye>
                <CustomEmptyState
                  icon={CubesIcon}
                  title="No custom rules available"
                  body="Upload a custom rule by clicking on 'Add rule'"
                />
              </Bullseye>
            }
          />
        </StackItem>
      </Stack>
    </>
  );
};
