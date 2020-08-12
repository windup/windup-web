import React from "react";
import { shallow } from "enzyme";
import { ButtonAboutApp } from "../ButtonAboutApp";

it("Test snapshot", () => {
  const wrapper = shallow(<ButtonAboutApp />);
  expect(wrapper).toMatchSnapshot();
});

it("Test snapshot :: open modal", () => {
  const wrapper = shallow(<ButtonAboutApp />);
  wrapper.find("#aboutButton").simulate("click");
  expect(wrapper).toMatchSnapshot();
});
