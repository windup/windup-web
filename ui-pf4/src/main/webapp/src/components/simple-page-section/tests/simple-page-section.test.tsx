import * as React from "react";
import { shallow } from "enzyme";
import { SimplePageSection } from "../simple-page-section";

describe("SimplePageSection", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<SimplePageSection title="complete" />);
    expect(wrapper).toMatchSnapshot();
  });
});
