import React from "react";
import { shallow } from "enzyme";
import { ProcessImprovementIcon } from "../process-improvement-icon";

describe("ProcessImprovementIcon", () => {
  it("expect to render", () => {
    const wrapper = shallow(<ProcessImprovementIcon />);
    expect(wrapper).toMatchSnapshot();
  });

  it("expect to render with props", () => {
    const wrapper = shallow(<ProcessImprovementIcon height="80px" />);
    expect(wrapper).toMatchSnapshot();
  });
});
