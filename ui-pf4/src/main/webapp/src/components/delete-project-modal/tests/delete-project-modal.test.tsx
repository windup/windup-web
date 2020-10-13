import React from "react";
import { shallow } from "enzyme";
import { DeleteProjectModal } from "../delete-project-modal";

describe("DeleteProjectModal", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <DeleteProjectModal
        projectTitle="master"
        matchText="delete"
        isModalOpen={true}
        onDelete={jest.fn}
        onCancel={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
