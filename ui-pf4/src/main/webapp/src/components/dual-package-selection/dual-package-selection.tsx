import * as React from "react";
import {
  Grid,
  GridItem,
  Button,
  ButtonVariant,
  Bullseye,
  Card,
  CardTitle,
  CardBody,
  Flex,
  FlexItem,
} from "@patternfly/react-core";
import {
  AngleRightIcon,
  AngleDoubleRightIcon,
  AngleLeftIcon,
  AngleDoubleLeftIcon,
} from "@patternfly/react-icons";

import { PackageSelection } from "../package-selection";
import { Package } from "../../models/api";

const disaggregatePackages = (
  packages: Package[],
  applicationPackages: Package[],
  thirdPartyPackages: Package[]
): void => {
  for (let i = 0; i < packages.length; i++) {
    const node = packages[i];

    const newNode1 = Object.assign({}, node, { childs: [] });
    const newNode2 = Object.assign({}, node, { childs: [] });

    if (node.known) {
      // If at least one child is unknown, then the node will be part of both Arrays
      if (node.childs && node.childs.some((p) => p.known == false)) {
        applicationPackages.push(newNode1);
        thirdPartyPackages.push(newNode2);
      } else {
        thirdPartyPackages.push(newNode2);
      }
    } else {
      applicationPackages.push(newNode1);
    }

    if (node.childs) {
      disaggregatePackages(node.childs, newNode1.childs, newNode2.childs);
    }
  }
};

const sortPackages = (tree: Package[]): Package[] => {
  tree.forEach((node) => sortPackages(node.childs));
  return tree.sort((a: Package, b: Package) => (a.name > b.name ? 1 : -1));
};

export interface DualPackageSelectionProps {
  packages: Package[];
  includedPackages: Package[];
  excludedPackages: Package[];
  height?: number;
  onChange: (includedPackages: Package[], excludedPackages: Package[]) => void;
}

export const DualPackageSelection: React.FC<DualPackageSelectionProps> = ({
  packages,
  includedPackages,
  excludedPackages,
  height = 350,
}) => {
  // const [, setApplicationPackages] = React.useState<Package[]>();
  // const [, setThirdPartyPackages] = React.useState<Package[]>();

  const [lefPackages, setLeftPackages] = React.useState<Package[]>();
  const [leftPackagesSelected, setLeftPackagesSelected] = React.useState<
    Package[]
  >([]);

  const [rightPackages, setRightPackages] = React.useState<Package[]>();
  const [rightPackagesSelected, setRightPackagesSelected] = React.useState<
    Package[]
  >([]);

  React.useEffect(() => {
    let newLefPackages: Package[] = [];
    let newRightPackages: Package[] = [];

    if (includedPackages.length == 0 && excludedPackages.length === 0) {
      const applicationPackages: Package[] = [];
      const thirdPartyPackages: Package[] = [];
      disaggregatePackages(packages, applicationPackages, thirdPartyPackages);

      newLefPackages = thirdPartyPackages;
      newRightPackages = applicationPackages;
    } else {
    }

    setLeftPackages(sortPackages(newLefPackages));
    setRightPackages(sortPackages(newRightPackages));
  }, [packages, includedPackages, excludedPackages]);

  const handleMoveAllToRight = () => {
    setLeftPackages([]);
    setLeftPackagesSelected([]);

    setRightPackages(packages);
    setRightPackagesSelected([]);
  };

  const handleMoveAllToLeft = () => {
    setLeftPackages(packages);
    setRightPackages([]);

    setRightPackagesSelected([]);
    setRightPackagesSelected([]);
  };

  const handleMoveToRight = () => {};
  const handleMoveToLeft = () => {};

  return (
    <React.Fragment>
      {lefPackages && rightPackages && (
        <Grid sm={4}>
          <GridItem span={5}>
            <Card>
              <CardTitle>Excluded packages</CardTitle>
              <CardBody style={{ height, overflowY: "auto" }}>
                <PackageSelection
                  packages={lefPackages}
                  onChange={(checked: Package[]) =>
                    setLeftPackagesSelected(checked)
                  }
                />
              </CardBody>
            </Card>
          </GridItem>
          <GridItem span={2}>
            <Bullseye>
              <Flex
                direction={{ default: "column" }}
                alignSelf={{ default: "alignSelfCenter" }}
              >
                <FlexItem>
                  <Button
                    variant={ButtonVariant.plain}
                    onClick={handleMoveToRight}
                  >
                    <AngleRightIcon />
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant={ButtonVariant.plain}
                    onClick={handleMoveAllToRight}
                  >
                    <AngleDoubleRightIcon />
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant={ButtonVariant.plain}
                    onClick={handleMoveAllToLeft}
                  >
                    <AngleDoubleLeftIcon />
                  </Button>
                </FlexItem>
                <FlexItem>
                  <Button
                    variant={ButtonVariant.plain}
                    onClick={handleMoveToLeft}
                  >
                    <AngleLeftIcon />
                  </Button>
                </FlexItem>
              </Flex>
            </Bullseye>
          </GridItem>
          <GridItem span={5}>
            <Card>
              <CardTitle>Included packages</CardTitle>
              <CardBody style={{ height, overflowY: "auto" }}>
                <PackageSelection
                  packages={rightPackages}
                  onChange={(checked: Package[]) =>
                    setRightPackagesSelected(checked)
                  }
                />
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      )}
    </React.Fragment>
  );
};
