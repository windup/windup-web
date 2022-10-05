import React from "react";

import {
  Title,
  Stack,
  StackItem,
  TextContent,
  TitleSizes,
  Text,
  Level,
  LevelItem,
  Tooltip,
  Button,
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  EmptyStateBody,
} from "@patternfly/react-core";
import { UndoIcon, SpinnerIcon } from "@patternfly/react-icons";

import { PackageDualList } from "components";

import { Package } from "models/api";

export interface PackageSelectionProps {
  packages: Package[];
  selectedPackages: string[];
  onSelectedPackagesChange: (values: string[]) => void;
  onUndo: () => void;

  isFetching: boolean;
  isFetchingPlaceholder: any;
  fetchError?: any;
  fetchErrorPlaceholder?: any;
}
export const PackageSelection: React.FC<PackageSelectionProps> = ({
  packages,
  selectedPackages,
  onSelectedPackagesChange,
  onUndo,
  isFetching,
  isFetchingPlaceholder,
  fetchError,
  fetchErrorPlaceholder,
}) => {
  return (
    <>
      {isFetching ? (
        isFetchingPlaceholder
      ) : fetchError ? (
        fetchErrorPlaceholder
      ) : (
        <Stack hasGutter>
          <StackItem>
            <TextContent>
              <Level>
                <LevelItem>
                  <Title headingLevel="h5" size={TitleSizes["lg"]}>
                    Select packages
                  </Title>
                  <Text component="small">
                    Select the Java packages you want to include in the
                    analysis. If no packages are explicitly included then all
                    packages will be analyzed.
                  </Text>
                </LevelItem>
                <LevelItem>
                  <Tooltip content={<div>Restore initial values.</div>}>
                    <Button variant="plain" aria-label="Undo" onClick={onUndo}>
                      <UndoIcon /> Undo
                    </Button>
                  </Tooltip>
                </LevelItem>
              </Level>
            </TextContent>
          </StackItem>
          <StackItem>
            <PackageDualList
              packages={packages}
              includedPackages={selectedPackages}
              onChange={onSelectedPackagesChange}
            />
          </StackItem>
        </Stack>
      )}
    </>
  );
};

export const PackageSelectionLoadingState: React.FC = () => {
  return (
    <Bullseye>
      <EmptyState
        variant={EmptyStateVariant.small}
        aria-label="package-loading-empty-state"
      >
        <EmptyStateIcon icon={SpinnerIcon} />
        <Title headingLevel="h2" size="lg">
          Discovering and fetching packages
        </Title>
        <EmptyStateBody>
          This process might take some time depending on the size of your
          applications.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};
