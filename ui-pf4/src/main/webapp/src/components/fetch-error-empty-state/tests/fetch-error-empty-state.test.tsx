import React from "react";
import { shallow } from "enzyme";
import { FetchErrorEmptyState } from "../fetch-error-empty-state";

describe("FetchErrorEmptyState", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<FetchErrorEmptyState />);
    expect(wrapper).toMatchSnapshot();
  });
});
