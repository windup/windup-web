import React, { useCallback, useEffect, useState } from "react";
import {
  Stack,
  StackItem,
  Title,
  TitleSizes,
  TextContent,
  Text,
  Button,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarItemVariant,
  Switch,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  ISortBy,
  SortByDirection,
  IActions,
} from "@patternfly/react-table";

import {
  FilterToolbarItem,
  SimplePagination,
  FetchTable,
  AddRuleLabelTabs,
} from "components";

import { useFetchProject } from "hooks/useFetchProject";
import { useFetchRules } from "hooks/useFetchRules/useFetchRules";
import { useDeleteRule } from "hooks/useDeleteRule";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { getAlertModel } from "Constants";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import { RulesPath, RuleProviderEntity } from "models/api";

interface CustomRulesProps {
  projectId: string | number;
}

export const CustomRules: React.FC<CustomRulesProps> = ({ projectId }) => {
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

  // Modal data
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table data
  const [tableData, setTableData] = useState<RulesPath[]>([]);

  const [filterText, setFilterText] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();
  const [rows, setRows] = useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Short path", transforms: [sortable] },
    { title: "Source/Target", transforms: [] },
    { title: "Number of rules", transforms: [] },
    { title: "Enable", transforms: [] },
  ];
  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number) => {
        const row: RulesPath = tableData[rowIndex];
        deleteRule(row, () => loadRules(projectId));
      },
    },
  ];

  //

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

  useEffect(() => {
    if (rulesPath && ruleProviders) {
      // Sort
      let sortedArray: RulesPath[] = [...rulesPath];

      const columnSortIndex = sortBy?.index;
      const columnSortDirection = sortBy?.direction;

      switch (columnSortIndex) {
        case 0: // title
          sortedArray.sort((a, b) =>
            (a.shortPath || a.path).localeCompare(b.shortPath || b.path)
          );
          break;
      }

      if (columnSortDirection === SortByDirection.desc) {
        sortedArray = sortedArray.reverse();
      }

      // Filter
      const filteredArray = sortedArray.filter(
        (p) => (p.shortPath || p.path).toLowerCase().indexOf(filterText) !== -1
      );

      setTableData(filteredArray);

      const rows: IRow[] = filteredArray.map((item: RulesPath) => {
        const ruleProviderEntity: RuleProviderEntity[] =
          ruleProviders.get(item) || [];

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

      // Paginate
      const paginatedRows = rows.slice(
        (paginationParams.page - 1) * paginationParams.perPage,
        paginationParams.page * paginationParams.perPage
      );

      setRows(paginatedRows);
    }
  }, [
    analysisContext,
    rulesPath,
    ruleProviders,
    filterText,
    paginationParams,
    sortBy,
    handleRulePathToggled,
  ]);

  // Table handlers

  const handlFilterTextChange = (filterText: string) => {
    const newParams = { page: 1, perPage: paginationParams.perPage };

    setFilterText(filterText);
    setPaginationParams(newParams);
  };

  const handlePaginationChange = ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => {
    setPaginationParams({ page, perPage });
  };

  // Modal handlers

  const handleModalToggle = () => {
    setIsModalOpen((current) => {
      if (current) {
        loadRules(projectId);
      }

      return !current;
    });
  };

  const handleOnDrawerToggle = () => {
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
          onSubmitFinishedServerPath={handleOnDrawerToggle}
          onCancelServerPath={handleOnDrawerToggle}
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
          <Toolbar>
            <ToolbarContent>
              <FilterToolbarItem
                searchValue={filterText}
                onFilterChange={handlFilterTextChange}
                placeholder="Filter by name"
              />
              <ToolbarGroup variant="button-group">
                <ToolbarItem>
                  <Button type="button" onClick={handleModalToggle}>
                    Add rule
                  </Button>
                </ToolbarItem>
              </ToolbarGroup>
              <ToolbarItem
                variant={ToolbarItemVariant.pagination}
                alignment={{ default: "alignRight" }}
              >
                <SimplePagination
                  count={tableData.length}
                  params={paginationParams}
                  isTop={true}
                  onChange={handlePaginationChange}
                />
              </ToolbarItem>
            </ToolbarContent>
          </Toolbar>
          <FetchTable
            columns={columns}
            rows={rows}
            actions={actions}
            fetchStatus={
              isFetchingProject || isFetchingRules ? "inProgress" : "complete"
            }
            fetchError={fetchProjectError || fetchRulesError}
            loadingVariant="skeleton"
            onSortChange={(sortBy: ISortBy) => {
              setSortBy(sortBy);
            }}
          />
          <SimplePagination
            count={tableData.length}
            params={paginationParams}
            onChange={handlePaginationChange}
          />
        </StackItem>
      </Stack>
    </>
  );
};
