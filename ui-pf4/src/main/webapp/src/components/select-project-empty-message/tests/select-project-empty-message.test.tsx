import React from "react";
import { shallow } from "enzyme";
import { SelectProjectEmptyMessage } from "../select-project-empty-message";

describe("SelectProjectEmptyMessage", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<SelectProjectEmptyMessage />);
    expect(wrapper).toMatchSnapshot();
  });
});
