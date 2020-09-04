import * as React from "react";

import { PackageSelection } from "components/package-selection";
import { useLoadPackages } from "hooks/useLoadPackages";

export interface PackageSelectionWrapperProps {
  applicationIds: number[];
  onChange: (includedPackages: string[]) => void;
}

export const PackageSelectionWrapper: React.FC<PackageSelectionWrapperProps> = ({
  applicationIds,
  onChange,
}) => {
  const { loading, packages, fetchPackages } = useLoadPackages({
    applicationIds,
  });

  React.useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <React.Fragment>
      {loading ? (
        <p>s</p>
      ) : (
        <PackageSelection
          packages={packages!}
          includedPackages={[]}
          onChange={onChange}
        />
      )}
    </React.Fragment>
  );
};
