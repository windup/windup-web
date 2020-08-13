import * as React from "react";
import { shallow } from "enzyme";
import { PageSkeleton } from "../page-skeleton";

describe("SimplePagination", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<PageSkeleton />);
    expect(wrapper).toMatchSnapshot();
  });
});
