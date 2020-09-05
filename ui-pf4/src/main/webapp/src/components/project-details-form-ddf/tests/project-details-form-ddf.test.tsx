import * as React from "react";
import { shallow } from "enzyme";
import { ProjectDetailsFormDDF } from "../project-details-form-ddf";

describe("ProjectDetailsFormDDF", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <ProjectDetailsFormDDF
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
