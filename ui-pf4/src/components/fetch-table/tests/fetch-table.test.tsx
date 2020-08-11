import * as React from "react";
import { shallow } from "enzyme";
import { FetchTable } from "../fetch-table";
import { ICell, IRow, IActions } from "@patternfly/react-table";

describe("FetchTable", () => {
  const columns: ICell[] = [
    { title: "Col1" },
    { title: "Col2" },
    { title: "Col3" },
  ];
  const rows: IRow[] = [...Array(15)].map((_, rowIndex) => {
    return {
      cells: [...Array(columns.length)].map((_, colIndex) => ({
        title: `${rowIndex},${colIndex}`,
      })),
    };
  });
  const actions: IActions = [
    {
      title: "Action1",
      onClick: jest.fn,
    },
    {
      title: "Action2",
      onClick: jest.fn,
    },
  ];

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <FetchTable
        columns={columns}
        rows={rows}
        actions={actions}
        fetchStatus="complete"
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
