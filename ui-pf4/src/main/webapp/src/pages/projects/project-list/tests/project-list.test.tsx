import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { render, screen } from '@testing-library/react';
import { AxiosError } from "axios";

import { Button, Skeleton } from "@patternfly/react-core";
import { Table } from "@patternfly/react-table";

import { filterProject, compareProject, ProjectList } from "../project-list";
import { Project } from "models/api";
import { AppPlaceholder, FetchErrorEmptyState, Welcome } from "components";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { rootReducer } from "store/rootReducer";
import {
  ProjectListState,
  defaultState,
  stateKey,
} from "store/projectList/reducer";

describe("ProjectList: filter", () => {
  const project: Project = {
    activeExecutionsCount: 0,
    applicationCount: 0,
    isDeletable: true,
    migrationProject: {
      id: 1,
      title: "my great title",
      description: "description",
      provisional: false,
      created: 1599551047711,
      lastModified: 1599551108682,
      applications: [],
      defaultAnalysisContextId: 3803,
    },
  };

  it("If filterText empty then true", () => {
    expect(filterProject("", project)).toBe(true);
  });

  it("If filterText blank string then true", () => {
    expect(filterProject(" ", project)).toBe(true);
  });

  it("FilterText is not empty then evaluate", () => {
    expect(filterProject("great", project)).toBe(true);
    expect(filterProject("something", project)).toBe(false);
  });

  it("FilterText is not empty then evaluate ignoring case", () => {
    expect(filterProject("GREAT", project)).toBe(true);
  });
});

describe("ProjectList: CompareTo", () => {
  const lastModified = 1599551108682;

  const projects: Project[] = [
    {
      activeExecutionsCount: 0,
      applicationCount: 2,
      isDeletable: true,
      migrationProject: {
        id: 1,
        title: "projectB",
        description: "description",
        provisional: false,
        created: 1599551047711,
        lastModified: lastModified + 2,
        applications: [],
        defaultAnalysisContextId: 3803,
      },
    },
    {
      activeExecutionsCount: 0,
      applicationCount: 1,
      isDeletable: true,
      migrationProject: {
        id: 2,
        title: "projectA",
        description: "description",
        provisional: false,
        created: 1599551047711,
        lastModified: lastModified + 1,
        applications: [],
        defaultAnalysisContextId: 3803,
      },
    },
    {
      activeExecutionsCount: 0,
      applicationCount: 3,
      isDeletable: true,
      migrationProject: {
        id: 3,
        title: "projectC",
        description: "description",
        provisional: false,
        created: 1599551047711,
        lastModified: lastModified + 3,
        applications: [],
        defaultAnalysisContextId: 3803,
      },
    },
  ];

  it("Sort by title", () => {
    const sortedArray = [...projects].sort((a, b) => compareProject(a, b, 0));

    expect(sortedArray[0].migrationProject.title).toBe("projectA");
    expect(sortedArray[1].migrationProject.title).toBe("projectB");
    expect(sortedArray[2].migrationProject.title).toBe("projectC");
  });

  it("Sort by number of applications", () => {
    const sortedArray = [...projects].sort((a, b) => compareProject(a, b, 1));

    expect(sortedArray[0].migrationProject.title).toBe("projectA");
    expect(sortedArray[1].migrationProject.title).toBe("projectB");
    expect(sortedArray[2].migrationProject.title).toBe("projectC");
  });

  it("Sort by lastModified", () => {
    const sortedArray = [...projects].sort((a, b) => compareProject(a, b, 2));

    expect(sortedArray[0].migrationProject.title).toBe("projectA");
    expect(sortedArray[1].migrationProject.title).toBe("projectB");
    expect(sortedArray[2].migrationProject.title).toBe("projectC");
  });

  it("Sort by a column not supported should not sort", () => {
    const sortedArray = [...projects].sort((a, b) => compareProject(a, b, 3));

    expect(sortedArray[0].migrationProject.title).toBe("projectB");
    expect(sortedArray[1].migrationProject.title).toBe("projectA");
    expect(sortedArray[2].migrationProject.title).toBe("projectC");
  });

  it("Sort by undefined column should not sort", () => {
    const sortedArray = [...projects].sort((a, b) => compareProject(a, b));

    expect(sortedArray[0].migrationProject.title).toBe("projectB");
    expect(sortedArray[1].migrationProject.title).toBe("projectA");
    expect(sortedArray[2].migrationProject.title).toBe("projectC");
  });
});

describe("ProjectList", () => {
  const historyPushMock = jest.fn();
  const routeProps: RouteComponentProps = {
    history: { push: historyPushMock } as any,
    location: {} as any,
    match: {} as any,
  };

  const mockStore = (initialStatus: any) =>
    createStore(
      rootReducer,
      initialStatus,
      composeWithDevTools(applyMiddleware(thunk))
    );

  const getWrapper = (state: ProjectListState = defaultState, props?: any) => (
    <Provider store={mockStore({ [stateKey]: state })}>
      <ProjectList {...routeProps} {...props} />
    </Provider>
  );

  it("Render 'loading' first time", () => {
    const wrapper = render(getWrapper());
    expect(wrapper.getByRole('heading')).toHaveTextContent("Loading...");
  });

  it("Renders welcome", () => {
    const defaultState: ProjectListState = {
      projects: [],
      status: "complete",
      error: undefined,
    };

    const wrapper = render(getWrapper(defaultState));
    expect(wrapper.getByRole('heading')).toHaveTextContent("Welcome to Windup");
  });

  it("Renders error", () => {
    const error: AxiosError = {} as AxiosError;
    const defaultState: ProjectListState = {
      projects: undefined,
      status: "complete",
      error: error,
    };

    const wrapper = render(getWrapper(defaultState));
    expect(wrapper.getByRole('heading', {level: 2})).toHaveTextContent("Unable to connect");
  });

  it("Test click 'Create project'", () => {
    const defaultState: ProjectListState = {
      projects: [],
      status: "complete",
      error: undefined,
    };

    const wrapper = render(getWrapper(defaultState));
    wrapper.getByText('Create project', { selector: 'button' }).click();
    expect(historyPushMock.mock.calls.length).toEqual(1);
  });

  it("Renders table content as skeleton", () => {
    const defaultState: ProjectListState = {
      projects: [
        {
          activeExecutionsCount: 0,
          applicationCount: 2,
          isDeletable: true,
          migrationProject: {
            id: 1,
            title: "my project title",
            description: "my description",
            provisional: false,
            created: 1599551047711,
            lastModified: 1599551047711,
            applications: [],
            defaultAnalysisContextId: 3803,
          },
        },
      ],
      status: "inProgress",
      error: undefined,
    };

    const wrapper = render(getWrapper(defaultState));
    expect(wrapper.container.getElementsByClassName('pf-c-skeleton').length).toBeGreaterThan(1);
  });

  // it("Renders table content", () => {
  //   const defaultState: ProjectListState = {
  //     projects: [
  //       {
  //         activeExecutionsCount: 0,
  //         applicationCount: 2,
  //         isDeletable: true,
  //         migrationProject: {
  //           id: 1,
  //           title: "my project title",
  //           description: "my description",
  //           provisional: false,
  //           created: 1599551047711,
  //           lastModified: 1599551047711,
  //           applications: [],
  //           defaultAnalysisContextId: 3803,
  //         },
  //       },
  //     ],
  //     status: "complete",
  //     error: undefined,
  //   };

  //   const wrapper = mount(getWrapper(defaultState));
  //   expect(wrapper.find(Skeleton).length).toEqual(0);
  // });
});
