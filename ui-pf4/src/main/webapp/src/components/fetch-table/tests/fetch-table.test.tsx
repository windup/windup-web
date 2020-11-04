import React from "react";
import { mount, shallow } from "enzyme";
import { Label, Skeleton, Spinner } from "@patternfly/react-core";
import {
  ICell,
  IRow,
  IActions,
  SortColumn,
  sortable,
} from "@patternfly/react-table";
import { FetchErrorEmptyState } from "components";

import { FetchTable } from "../fetch-table";
import { NoResultsFound } from "../no-results-found";

describe("FetchTable", () => {
  const columns: ICell[] = [
    { title: "Col1", transforms: [sortable] },
    { title: "Col2" },
    { title: "Col3" },
  ];
  const rows: IRow[] = [...Array(15)].map((_, rowIndex) => {
    return {
      cells: [...Array(columns.length)].map((_, colIndex) => ({
        title: <Label>${`${rowIndex},${colIndex}`}</Label>,
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
      <FetchTable columns={columns} fetchStatus="complete" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders error", () => {
    const wrapper = mount(
      <FetchTable
        rows={rows}
        columns={columns}
        fetchStatus="complete"
        fetchError={"Any error"}
      />
    );
    expect(wrapper.find(FetchErrorEmptyState).length).toEqual(1);
  });

  it("Renders loading with skeleton", () => {
    const wrapper = mount(
      <FetchTable
        rows={rows}
        columns={columns}
        fetchStatus="inProgress"
        loadingVariant={"skeleton"}
      />
    );
    expect(wrapper.find(Skeleton).length).toBeGreaterThan(1);
  });

  it("Renders loading with spinner", () => {
    const wrapper = mount(
      <FetchTable
        rows={rows}
        columns={columns}
        fetchStatus="inProgress"
        loadingVariant={"spinner"}
      />
    );
    expect(wrapper.find(Spinner).length).toBe(1);
  });

  it("Renders empty table", () => {
    const wrapper = mount(
      <FetchTable rows={[]} columns={columns} fetchStatus="complete" />
    );
    expect(wrapper.find(NoResultsFound).length).toEqual(1);
  });

  it("Render rows with static actions", () => {
    const wrapper = mount(
      <FetchTable
        rows={rows}
        columns={columns}
        actions={actions}
        fetchStatus="complete"
      />
    );
    expect(wrapper.find(Label).length).toEqual(45); // 3 columns * 15 rows
  });

  it("Renders on sort", () => {
    const onSortMock = jest.fn();

    const wrapper = mount(
      <FetchTable
        rows={rows}
        columns={columns}
        fetchStatus="complete"
        onSortChange={onSortMock}
      />
    );

    wrapper.find(SortColumn).simulate("click");
    expect(onSortMock.mock.calls.length).toEqual(1);
  });
});
