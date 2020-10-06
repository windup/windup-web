import React, { useEffect, useState, useCallback } from "react";
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
  Tooltip,
} from "@patternfly/react-core";
import {
  ICell,
  sortable,
  IRow,
  ISortBy,
  SortByDirection,
  IActions,
} from "@patternfly/react-table";
import { WarningTriangleIcon } from "@patternfly/react-icons";

import {
  FilterToolbarItem,
  SimplePagination,
  FetchTable,
  AddRuleLabelTabs,
} from "components";

import { useFetchProject } from "hooks/useFetchProject";
import { useFetchLabels } from "hooks/useFetchLabels/useFetchLabels";
import { useDeleteLabel } from "hooks/useDeleteLabel";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";

import { getAlertModel } from "Constants";
import { getAnalysisContext, saveAnalysisContext } from "api/api";
import { LabelsPath, LabelProviderEntity } from "models/api";

interface CustomLabelsProps {
  projectId: string | number;
}

export const CustomLabels: React.FC<CustomLabelsProps> = ({ projectId }) => {
  const dispatch = useDispatch();

  const deleteLabel = useDeleteLabel();

  const {
    project,
    analysisContext,
    isFetching: isFetchingProject,
    fetchError: fetchProjectError,
    loadProject,
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

  // Modal data
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Table data
  const [tableData, setTableData] = useState<LabelsPath[]>([]);

  const [filterText, setFilterText] = useState("");
  const [paginationParams, setPaginationParams] = useState({
    page: 1,
    perPage: 10,
  });
  const [sortBy, setSortBy] = useState<ISortBy>();
  const [rows, setRows] = useState<IRow[]>();

  const columns: ICell[] = [
    { title: "Short path", transforms: [sortable] },
    { title: "Number of labels", transforms: [] },
    { title: "Enable", transforms: [] },
  ];
  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number) => {
        const row: LabelsPath = tableData[rowIndex];
        deleteLabel(row, () => loadLabels(projectId));
      },
    },
  ];

  //

  const handleLabelPathToggled = useCallback(
    (isChecked: boolean, labelPathToggled: LabelsPath) => {
      if (!project) {
        return;
      }

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
    if (labelsPath && labelProviders) {
      // Sort
      let sortedArray: LabelsPath[] = [...labelsPath];

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

      const rows: IRow[] = filteredArray.map((item: LabelsPath) => {
        const labelProviderEntity: LabelProviderEntity[] =
          labelProviders.get(item) || [];

        const numberOfLabels: number = labelProviderEntity.reduce(
          (counter, element) => counter + element.labels.length,
          0
        );

        const errors: string[] = labelProviderEntity.reduce(
          (array, element) =>
            element.loadError ? [...array, element.loadError] : array,
          [] as string[]
        );

        return {
          cells: [
            {
              title: (
                <>
                  {errors.length > 0 && (
                    <Tooltip content={<div>{errors.join(",")}</div>}>
                      <span>
                        <WarningTriangleIcon />
                        &nbsp;
                      </span>
                    </Tooltip>
                  )}
                  <span>{item.shortPath || item.path}</span>
                </>
              ),
            },
            {
              title: numberOfLabels,
            },
            {
              title: (
                <Switch
                  aria-label="Enabled"
                  isChecked={
                    !!analysisContext?.labelsPaths.find((f) => f.id === item.id)
                  }
                  onChange={(isChecked) =>
                    handleLabelPathToggled(isChecked, item)
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
    labelsPath,
    labelProviders,
    filterText,
    paginationParams,
    sortBy,
    handleLabelPathToggled,
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
        loadLabels(projectId);
      }

      return !current;
    });
  };

  const handleOnDrawerToggle = () => {
    setIsModalOpen((current) => !current);
    loadLabels(projectId);
  };

  return (
    <>
      <Modal
        variant={ModalVariant.medium}
        title="Add labels"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <AddRuleLabelTabs
          type="Label"
          projectId={projectId}
          onSubmitFinishedServerPath={handleOnDrawerToggle}
          onCancelServerPath={handleOnDrawerToggle}
        />
      </Modal>

      <Stack hasGutter>
        <StackItem>
          <TextContent>
            <Title headingLevel="h5" size={TitleSizes["lg"]}>
              Custom labels
            </Title>
            <Text component="small">
              Upload the labels you want yo include in the analysis
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
                    Add label
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
              isFetchingProject || isFetchingLabels ? "inProgress" : "complete"
            }
            fetchError={fetchProjectError || fetchLabelsError}
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
