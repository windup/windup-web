import * as React from "react";
import { shallow } from "enzyme";
import { UploadFilesSection } from "../upload-files-section";

describe("Welcome", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<UploadFilesSection />);
    expect(wrapper).toMatchSnapshot();
  });
});
