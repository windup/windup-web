import React from "react";
import { shallow } from "enzyme";
import { DeleteButton } from "../delete-button";

describe("DeleteButton", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <DeleteButton
        objType="Project"
        objID="master"
        messageMatch="delete"
        onDelete={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
