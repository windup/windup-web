import * as React from "react";
import { shallow } from "enzyme";
import { UploadFiles } from "../upload-directory";

describe("Welcome", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<UploadFiles />);
    expect(wrapper).toMatchSnapshot();
  });
});
