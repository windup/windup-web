import * as React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { PackageSelection, PackageSelectionProps } from "../package-selection";
import { ApiResponse } from "./application-packages-example";

var manyPackages = require("./manypackages.json");

export default {
  title: "Components / PackageSelection",
  component: PackageSelection,
  argTypes: {
    onChange: { action: "onChange" },
  },
} as Meta;

const Template: Story<PackageSelectionProps> = (args) => (
  <PackageSelection {...args} />
);

// const packageToNode = (node: Package): Node => {
//   return {
//     label: node.name,
//     value: {
//       ...node,
//       toString: () => node.name,
//       compareTo: (obj: any) => {
//         return obj !== undefined && node.fullName === obj.fullName;
//       },
//     },
//     children: node.childs.map((child) => packageToNode(child)),
//   };
// };

export const Basic = Template.bind({});
Basic.args = {
  packages: [
    {
      id: 1,
      name: "node1",
      fullName: "node1",
      countClasses: 2,
      childs: [
        {
          id: 100,
          name: "subnode1",
          fullName: "node1.subnode1",
          countClasses: 0,
          known: true,
          level: 2,
          childs: [],
        },
        {
          id: 101,
          name: "subnode2",
          fullName: "node1.subnode2",
          countClasses: 0,
          known: true,
          level: 2,
          childs: [],
        },
      ],
      known: true,
      level: 1,
    },
    {
      id: 2,
      name: "node2",
      fullName: "node2",
      countClasses: 2,
      childs: [
        {
          id: 200,
          name: "subnode1",
          fullName: "node2.subnode1",
          countClasses: 0,
          known: true,
          level: 2,
          childs: [],
        },
        {
          id: 201,
          name: "subnode2",
          fullName: "node2.subnode2",
          countClasses: 0,
          known: true,
          level: 2,
          childs: [],
        },
      ],
      known: true,
      level: 1,
    },
  ],
};

export const AdministracionEfectivo = Template.bind({});
AdministracionEfectivo.args = {
  // checked: [ApiResponse.packageTree[0], ApiResponse.packageTree[1]],
  packages: ApiResponse.packageTree,
  // sort: (a, b) => a.value.name.localeCompare(b.value.name),
};

export const ManyPackages = Template.bind({});
ManyPackages.args = {
  packages: manyPackages.packageTree,
};
