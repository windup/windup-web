import * as React from "react";
import { shallow } from "enzyme";
import { SortByMenu } from "../sort-by-menu";

describe("Welcome", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SortByMenu options={["Option1", "Option2"]} onChange={jest.fn} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
