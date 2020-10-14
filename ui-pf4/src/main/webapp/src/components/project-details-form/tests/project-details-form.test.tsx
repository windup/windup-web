import React from "react";
import { shallow } from "enzyme";
import { Formik } from "formik";
import { Form } from "@patternfly/react-core";
import {
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
} from "../schema";
import { ProjectDetailsForm } from "../project-details-form";

describe("ProjectDetailsForm", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <Formik
        initialValues={projectDetailsFormInitialValue()}
        validationSchema={projectDetailsFormSchema()}
        onSubmit={jest.fn()}
      >
        {({ handleSubmit, ...formik }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <ProjectDetailsForm {...{ ...formik, handleSubmit }} />
            </Form>
          );
        }}
      </Formik>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
