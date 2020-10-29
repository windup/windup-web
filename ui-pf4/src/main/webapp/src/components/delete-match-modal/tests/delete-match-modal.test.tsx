import React from "react";
import { shallow } from "enzyme";
import { DeleteMatchModal } from "../delete-match-modal";

describe("DeleteMatchModal", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <DeleteMatchModal
        isModalOpen={true}
        title="Delete modal title"
        message="Are you sure you want to delete this?"
        matchText="delete"
        onDelete={jest.fn}
        onCancel={jest.fn}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  // it("Activate 'delete' button when match", () => {
  //   const matchText = "match this text";

  //   const mockDeleteCallBack = jest.fn();

  //   const wrapper = mount(
  //     <DeleteMatchModal
  //       isModalOpen={true}
  //       title="Delete modal title"
  //       message="Are you sure you want to delete this?"
  //       matchText={matchText}
  //       inProgress={false}
  //       onDelete={mockDeleteCallBack}
  //       onCancel={jest.fn()}
  //     />
  //   );

  //   // Verify action buttons
  //   const deleteButton = wrapper.find(Button).at(1);
  //   const cancelButton = wrapper.find(Button).at(2);

  //   expect(deleteButton.props().children).toEqual("Delete");
  //   expect(cancelButton.props().children).toEqual("Cancel");

  //   expect(deleteButton.props().isDisabled).toEqual(true);
  //   expect(cancelButton.props().isDisabled).toEqual(false);

  //   //
  //   wrapper
  //     .find(TextInput)
  //     .simulate("change", { target: { value: matchText } });
  //   wrapper.update();

  //   expect(wrapper.find(TextInput).props()).toEqual(matchText);
  //   expect(wrapper.find(Button).at(1).props().isDisabled).toEqual(false);
  // });
});
