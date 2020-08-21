import * as React from "react";
import { shallow } from "enzyme";
import { UploadFilesTab } from "../upload-files-tab";

describe("Welcome", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<UploadFilesTab />);
    expect(wrapper).toMatchSnapshot();
  });
});
