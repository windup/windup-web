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
  IActions,
  ICell,
  IRow,
  IRowData,
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

import { LabelProviderEntity, LabelsPath } from "models/api";

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

  const actions: IActions = [
    {
      title: "Delete",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: LabelsPath = rowData[LABELPATH_FIELD];
        deleteLabel(row, () => loadGlobalLabels());
      },
    },
  ];

  const toIRowFn = useCallback(
    (labelPaths: LabelsPath[]): IRow[] => {
      return labelPaths.map((item) => {
        const labelProviderEntity: LabelProviderEntity[] =
          labelProviders?.get(item) || [];

        const numberOfLabels: number = labelProviderEntity.reduce(
          (counter, element) => counter + element.labels.length,
          0
        );

        const errors = labelProviderEntity.reduce((errors, element) => {
          return element.loadError ? [...errors, element.loadError] : [];
        }, [] as string[]);

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
        actions={actions}
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
