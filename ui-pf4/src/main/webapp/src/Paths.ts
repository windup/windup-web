export const formatPath = (path: Paths, data: any) => {
  let url = path as string;

  for (const k of Object.keys(data)) {
    url = url.replace(":" + k, data[k]);
  }

  return url;
};

export enum Paths {
  base = "/",
  notFound = "/not-found",

  projects = "/projects",

  newProject = "/projects/~new",
  newProject_details = "/projects/~new/:project/project-details",
  newProject_addApplications = "/projects/~new/:project/add-appplications",
  newProject_setTransformationPath = "/projects/~new/:project/set-transformation-path",
  newProject_selectPackages = "/projects/~new/:project/select-packages",
  newProject_customRules = "/projects/~new/:project/custom-rules",
  newProject_customLabels = "/projects/~new/:project/custom-labels",
  newProject_advandedOptions = "/projects/~new/:project/advanced-options",
  newProject_review = "/projects/~new/:project/review",

  editProject = "/projects-details/:project",

  editProject_analysisResults = "/projects-details/:project/analysis-results",
  editProject_executionList = "/projects-details/:project/analysis-results/executions",
  editProject_executionDetails = "/projects-details/:project/analysis-results/executions/:execution",

  editProject_applications = "/projects-details/:project/applications",
  editProject_analysisConfiguration = "/projects-details/:project/analysis-configuration",
}
