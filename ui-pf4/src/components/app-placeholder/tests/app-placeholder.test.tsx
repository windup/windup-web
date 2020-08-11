import * as React from "react";
import { shallow } from "enzyme";
import { AppPlaceholder } from "../app-placeholder";

describe("FetchTable", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<AppPlaceholder />);
    expect(wrapper).toMatchSnapshot();
  });
});
