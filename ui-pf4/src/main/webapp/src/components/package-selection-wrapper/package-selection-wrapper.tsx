import * as React from "react";

import {
  Bullseye,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from "@patternfly/react-core";
import { SpinnerIcon } from "@patternfly/react-icons";

import { PackageSelection } from "components/package-selection";
import { useLoadPackages } from "hooks/useLoadPackages";

import { Package } from "models/api";

export interface PackageSelectionWrapperProps {
  applicationIds: number[];
  includedPackages: string[];
  onChange: (includedPackages: string[], packages: Package[]) => void;
}

export const PackageSelectionWrapper: React.FC<PackageSelectionWrapperProps> = ({
  applicationIds,
  includedPackages,
  onChange,
}) => {
  const { loading, packages, fetchPackages } = useLoadPackages({
    applicationIds,
  });

  React.useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleOnPackageSelectionChange = (includedPackageIds: string[]) => {
    onChange(includedPackageIds, packages!);
  };

  return (
    <React.Fragment>
      {loading ? (
        <Bullseye>
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateIcon icon={SpinnerIcon} />
            <Title headingLevel="h4" size="lg">
              Discovering packages
            </Title>
            <EmptyStateBody>
              This process might take long depending of the size of your
              applications, you can skip this step and use the default
              configuration. By default MTA will analyse Application Packages
              and exclude any Third Pary Packages.
            </EmptyStateBody>
          </EmptyState>
        </Bullseye>
      ) : (
        packages && (
          <PackageSelection
            packages={packages}
            includedPackages={includedPackages}
            onChange={handleOnPackageSelectionChange}
          />
        )
      )}
    </React.Fragment>
  );
};
