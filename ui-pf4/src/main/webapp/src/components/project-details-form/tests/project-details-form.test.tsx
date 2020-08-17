import * as React from "react";
import { shallow } from "enzyme";
import { ProjectDetailsForm } from "../project-details-form";

describe("FetchTable", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <ProjectDetailsForm
        onSubmit={jest.fn}
        onCancel={jest.fn}
        searchProjectByName={(value: string): Promise<any> =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(undefined);
            }, 1000);
          })
        }
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
