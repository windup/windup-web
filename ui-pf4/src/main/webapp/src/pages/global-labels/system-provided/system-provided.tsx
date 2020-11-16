import React, { useCallback, useEffect, useState } from "react";

import { Bullseye } from "@patternfly/react-core";
import {
  IAction,
  ICell,
  IRow,
  IRowData,
  ISeparator,
  sortable,
} from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import { CustomEmptyState, TableSectionOffline } from "components";
import { useFetchLabels } from "hooks/useFetchLabels";
import { useShowRuleLabelDetails } from "hooks/useShowRuleLabelDetails";

import { LabelProviderEntity, LabelsPath } from "models/api";

const LABEL_PROVIDER_ENTITY_FIELD = "labelPath";

const columns: ICell[] = [
  { title: "Provider ID", transforms: [sortable] },
  { title: "Number of labels", transforms: [] },
];

const compareLabelPath = (
  a: LabelProviderEntity,
  b: LabelProviderEntity,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 0: // Provider ID
      return a.providerID.localeCompare(b.providerID);
    default:
      return 0;
  }
};

const filterLabelPath = (filterText: string, item: LabelProviderEntity) => {
  return item.providerID.toLowerCase().includes(filterText.toLowerCase());
};

const getSystemProvidedLabelProviderEntities = (
  labelsPath: LabelsPath[],
  labelProviders: Map<number, LabelProviderEntity[]>
) => {
  const systemProvidedLabelsPath = labelsPath?.find(
    (f) => f.labelsPathType === "SYSTEM_PROVIDED"
  );

  return {
    systemLabelPath: systemProvidedLabelsPath,
    systemLabelProviders: systemProvidedLabelsPath
      ? labelProviders.get(systemProvidedLabelsPath.id)
      : [],
  };
};

export const SystemProvided: React.FC = () => {
  const [tableData, setTableData] = useState<LabelProviderEntity[]>();

  const showRuleLabelDetails = useShowRuleLabelDetails();

  const {
    labelsPath,
    labelProviders,
    isFetching,
    fetchError,
    loadGlobalLabels,
  } = useFetchLabels();

  useEffect(() => {
    loadGlobalLabels();
  }, [loadGlobalLabels]);

  useEffect(() => {
    if (labelsPath && labelProviders) {
      const { systemLabelProviders } = getSystemProvidedLabelProviderEntities(
        labelsPath,
        labelProviders
      );
      const newTableData = systemLabelProviders?.slice().sort((a, b) => {
        return a.providerID.localeCompare(b.providerID);
      });

      setTableData(newTableData);
    }
  }, [labelsPath, labelProviders]);

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: LabelProviderEntity = getRowValue(rowData);

    const viewDetailsAction: IAction = {
      title: "View details",
      onClick: (_, rowIndex: number, rowData: IRowData) => {
        const row: LabelProviderEntity = getRowValue(rowData);

        showRuleLabelDetails("Label", undefined, [row]);
      },
    };

    return [...(row.labels.length > 0 ? [viewDetailsAction] : [])];
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  const getRowValue = (rowData: IRowData): LabelProviderEntity => {
    return rowData[LABEL_PROVIDER_ENTITY_FIELD];
  };

  const labelPathToIRow = useCallback(
    (labelProviderEntity: LabelProviderEntity[]): IRow[] => {
      return labelProviderEntity.map((item) => {
        return {
          [LABEL_PROVIDER_ENTITY_FIELD]: item,
          cells: [
            {
              title: item.providerID,
            },
            {
              title: item.labels.length,
            },
          ],
        };
      });
    },
    []
  );

  return (
    <TableSectionOffline
      items={tableData}
      columns={columns}
      actionResolver={actionResolver}
      areActionsDisabled={areActionsDisabled}
      loadingVariant="skeleton"
      isLoadingData={isFetching || !tableData}
      loadingDataError={fetchError}
      compareItem={compareLabelPath}
      filterItem={filterLabelPath}
      mapToIRow={labelPathToIRow}
      hideFilterText={false}
      filterTextPlaceholder="Filter by provider ID"
      emptyState={
        <Bullseye>
          <CustomEmptyState
            icon={CubesIcon}
            title="No sytem provided labels available"
            body="Make sure your server contains system provided labels."
          />
        </Bullseye>
      }
    />
  );
};
