import React from "react";
import { shallow } from "enzyme";
import { HeaderApp, HeaderProps } from "../HeaderApp";
import { Button } from "@patternfly/react-core";

it("Test snapshot", () => {
  const props: HeaderProps = {
    aboutButton: <Button>About Button</Button>,
  };

  const wrapper = shallow(<HeaderApp {...props} />);
  expect(wrapper).toMatchSnapshot();
});
