import React from "react";
import { shallow } from "enzyme";
import { Formik } from "formik";
import { Form } from "@patternfly/react-core";
import {
  projectDetailsFormInitialValue,
  projectDetailsFormSchema,
  PROJECT_NAME_REGEX,
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

  it("Verify ProjectName regex", () => {
    expect(PROJECT_NAME_REGEX.test("myProject")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test("my_project")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test("my project")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test("my project 123")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test(" my project 123 ")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test("123 my project")).toEqual(true);
    expect(PROJECT_NAME_REGEX.test("_ 123 MY PROJECT")).toEqual(true);

    expect(PROJECT_NAME_REGEX.test("myProject!")).toEqual(false);
  });
});
