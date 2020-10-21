import React, { useCallback, useEffect, useState } from "react";

import {
  Bullseye,
  Button,
  Modal,
  ModalVariant,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  IAction,
  ICell,
  IRow,
  IRowData,
  ISeparator,
  sortable,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import {
  AddRuleLabelTabs,
  CustomEmptyState,
  RulelabelTitle,
  TableSectionOffline,
} from "components";
import { useDeleteLabel } from "hooks/useDeleteLabel";
import { useFetchLabels } from "hooks/useFetchLabels";
import { useShowRuleLabelDetails } from "hooks/useShowRuleLabelDetails";

import { LabelProviderEntity, LabelsPath } from "models/api";
import {
  getErrorsFromLabelProviderEntity,
  getNumberOfLabelsFromLabelProviderEntity,
} from "utils/modelUtils";

const LABELPATH_FIELD = "labelPath";

const columns: ICell[] = [
  { title: "Short path", transforms: [sortable] },
  { title: "Number of labels", transforms: [] },
];

const compareFn = (a: LabelsPath, b: LabelsPath, columnIndex?: number) => {
  switch (columnIndex) {
    case 0: // Short path
      return (a.shortPath || a.path).localeCompare(b.shortPath || b.path);
    default:
      return 0;
  }
};

const filterFn = (filterText: string, labelPath: LabelsPath) => {
  return (
    (labelPath.shortPath || labelPath.path)
      .toLowerCase()
      .indexOf(filterText.toLowerCase()) !== -1
  );
};

export const UserProvided: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProvidedLabelsPath, setUserProvidedLabelsPath] = useState<
    LabelsPath[]
  >();

  const deleteLabel = useDeleteLabel();
  const showRuleLabelDetails = useShowRuleLabelDetails();

  const {
    labelsPath,
    labelProviders,
    isFetching: isFetchingLabels,
    fetchError: fetchLabelsError,
    loadGlobalLabels,
  } = useFetchLabels();

  useEffect(() => {
    if (labelsPath) {
      const newUserProvidedLabelsPath = labelsPath
        .filter((f) => f.labelsPathType === "USER_PROVIDED")
        .sort((a, b) =>
          (a.shortPath || a.path).localeCompare(b.shortPath || b.path)
        );
      setUserProvidedLabelsPath(newUserProvidedLabelsPath);
    }
  }, [labelsPath]);

  useEffect(() => {
    loadGlobalLabels();
  }, [loadGlobalLabels]);

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
          deleteLabel(row, () => loadGlobalLabels());
        },
      },
    ];
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  const getRowLabelPathField = (rowData: IRowData): LabelsPath => {
    return rowData[LABELPATH_FIELD];
  };

  const toIRowFn = useCallback(
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
                  name={item.shortPath || item.path}
                  errors={errors}
                  numberOfRulesLabels={numberOfLabels}
                />
              ),
            },
            {
              title: numberOfLabels,
            },
          ],
        };
      });
    },
    [labelProviders]
  );

  const handleModalToggle = () => {
    setIsModalOpen((current) => {
      if (current) {
        loadGlobalLabels();
      }
      return !current;
    });
  };

  const handleOnLabelLabelClose = () => {
    setIsModalOpen((current) => !current);
    loadGlobalLabels();
  };

  return (
    <>
      <TableSectionOffline
        items={userProvidedLabelsPath}
        columns={columns}
        actionResolver={actionResolver}
        areActionsDisabled={areActionsDisabled}
        loadingVariant="skeleton"
        isLoadingData={isFetchingLabels}
        loadingDataError={fetchLabelsError}
        compareItem={compareFn}
        filterItem={filterFn}
        mapToIRow={toIRowFn}
        toolbar={
          <ToolbarGroup variant="button-group">
            <ToolbarItem>
              <Button type="button" onClick={handleModalToggle}>
                Add label
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        }
        emptyState={
          <Bullseye>
            <CustomEmptyState
              icon={CubesIcon}
              title="No custom labels available"
              body="Upload a custom label by clicking on 'Add label'"
            />
          </Bullseye>
        }
      />
      <Modal
        variant={ModalVariant.medium}
        title="Add labels"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
      >
        <AddRuleLabelTabs
          type="Label"
          onSubmitFinishedServerPath={handleOnLabelLabelClose}
          onCancelServerPath={handleOnLabelLabelClose}
        />
      </Modal>
    </>
  );
};
