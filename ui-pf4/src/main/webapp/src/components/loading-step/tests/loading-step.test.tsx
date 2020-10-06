import React from "react";
import { shallow } from "enzyme";
import { LoadingStep } from "../loading-step";

describe("Welcome", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<LoadingStep />);
    expect(wrapper).toMatchSnapshot();
  });
});
