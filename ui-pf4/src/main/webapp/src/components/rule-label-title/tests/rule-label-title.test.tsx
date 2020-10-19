import React from "react";
import { shallow } from "enzyme";
import { RulelabelTitle } from "../rule-label-title";

describe("RulelabelTitle", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <RulelabelTitle name="My rule" errors={[]} numberOfRulesLabels={0} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
