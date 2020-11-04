import React from "react";
import { mount, shallow } from "enzyme";
import { Button } from "@patternfly/react-core";

import { NoResultsFound } from "../no-results-found";

describe("FetchTable", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<NoResultsFound />);
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders callback", () => {
    const callbackMock = jest.fn();

    const wrapper = mount(<NoResultsFound onClearFilters={callbackMock} />);

    wrapper.find(Button).simulate("click");
    expect(callbackMock.mock.calls.length).toEqual(1);
  });
});
