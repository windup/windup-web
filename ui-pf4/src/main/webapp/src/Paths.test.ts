import { formatPath, Paths } from "Paths";

describe("Paths", () => {
  it("Test correct formatPath", () => {
    const result = formatPath(Paths.editExecution, {
      project: "myProject",
      execution: "myExecution",
    });
    expect(result).toEqual(
      "/projects-details/myProject/analysis-results/executions/myExecution"
    );
  });

  it("Test incorrect formatPath", () => {
    const result = formatPath(Paths.editExecution, {
      incorrectVar: "myId",
    });
    expect(result).toEqual(
      "/projects-details/:project/analysis-results/executions/:execution"
    );
  });
});
