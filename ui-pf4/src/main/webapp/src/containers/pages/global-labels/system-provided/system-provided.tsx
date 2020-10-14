import React, { useCallback, useEffect, useState } from "react";

import { Bullseye } from "@patternfly/react-core";
import { IActions, ICell, IRow, sortable } from "@patternfly/react-table";
import { CubesIcon } from "@patternfly/react-icons";

import { CustomEmptyState, TableSectionOffline } from "components";
import { useFetchLabels } from "hooks/useFetchLabels";

import { LabelProviderEntity, LabelsPath } from "models/api";

const LABEL_PROVIDER_ENTITY_FIELD = "labelPath";

const columns: ICell[] = [
  { title: "Number of labels", transforms: [] },
  { title: "Provider ID", transforms: [sortable] },
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
  labelsPath?: LabelsPath[],
  labelProviders?: Map<LabelsPath, LabelProviderEntity[]>
) => {
  const systemProvidedLabelsPath = labelsPath?.find(
    (f) => f.labelsPathType === "SYSTEM_PROVIDED"
  );
  if (systemProvidedLabelsPath) {
    return labelProviders?.get(systemProvidedLabelsPath);
  }
};

export const SystemProvided: React.FC = () => {
  const [tableData, setTableData] = useState<LabelProviderEntity[]>();

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
      const newTableData = getSystemProvidedLabelProviderEntities(
        labelsPath,
        labelProviders
      )
        ?.slice()
        .sort((a, b) => {
          return a.providerID.localeCompare(b.providerID);
        });

      setTableData(newTableData);
    }
  }, [labelsPath, labelProviders]);

  const actions: IActions = [];

  const labelPathToIRow = useCallback(
    (labelProviderEntity: LabelProviderEntity[]): IRow[] => {
      return labelProviderEntity.map((item) => {
        const numberOfLabels: number = labelProviderEntity.reduce(
          (counter, element) => counter + element.labels.length,
          0
        );
        return {
          [LABEL_PROVIDER_ENTITY_FIELD]: item,
          cells: [
            {
              title: item.providerID,
            },
            {
              title: numberOfLabels,
            },
          ],
        };
      });
    },
    []
  );

  return (
    <TableSectionOffline
      items={tableData || []}
      columns={columns}
      actions={actions}
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
            body="Make sure your server contains system provided labels"
          />
        </Bullseye>
      }
    />
  );
};
