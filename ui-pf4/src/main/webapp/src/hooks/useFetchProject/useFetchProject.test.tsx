import { renderHook, act } from "@testing-library/react-hooks";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { AnalysisContext, MigrationProject } from "models/api";
import { useFetchProject } from "./useFetchProject";

describe("useFetchProject", () => {
  it("Fetch error due to no REST API found", async () => {
    const PROJECT_ID = 1;

    // Mock REST API
    new MockAdapter(axios)
      .onGet(`/migrationProjects/get/${PROJECT_ID}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchProject());

    const {
      project,
      analysisContext,
      isFetching,
      fetchError,
      fetchProject,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(project).toBeUndefined();
    expect(analysisContext).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchProject(PROJECT_ID));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(project).toBeUndefined();
    expect(analysisContext).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    const PROJECT_ID = 1;
    const ANALYSIS_CONTEXT_ID = 2;

    // Mock REST API
    const mockProject: MigrationProject = {
      id: PROJECT_ID,
      provisional: true,
      title: "Test",
      description: "",
      created: 1606995595867,
      lastModified: 1606996773683,
      applications: [],
      defaultAnalysisContextId: ANALYSIS_CONTEXT_ID,
    };
    const mockAnalysisContext: AnalysisContext = {
      id: ANALYSIS_CONTEXT_ID,
      version: 4,
      generateStaticReports: true,
      cloudTargetsIncluded: false,
      linuxTargetsIncluded: false,
      openJdkTargetsIncluded: false,
      advancedOptions: [],
      rulesPaths: [],
      labelsPaths: [],
      includePackages: [],
      excludePackages: [],
      applications: [],
    };

    new MockAdapter(axios)
      .onGet(`/migrationProjects/get/${PROJECT_ID}`)
      .reply(200, mockProject)
      .onGet(`/analysis-context/${ANALYSIS_CONTEXT_ID}`)
      .reply(200, mockAnalysisContext);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchProject());

    const {
      project,
      analysisContext,
      isFetching,
      fetchError,
      fetchProject,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(project).toBeUndefined();
    expect(analysisContext).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchProject(PROJECT_ID));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.project).toMatchObject(mockProject);
    expect(result.current.analysisContext).toMatchObject(mockAnalysisContext);
    expect(result.current.fetchError).toBeUndefined();
  });
});
