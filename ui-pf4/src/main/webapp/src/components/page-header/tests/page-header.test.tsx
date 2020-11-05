import React from "react";
import { shallow } from "enzyme";
import { PageHeader } from "../page-header";

describe("PageHeader", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<PageHeader title="complete" />);
    expect(wrapper).toMatchSnapshot();
  });
});
