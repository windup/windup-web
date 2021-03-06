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

  globalRules = "/global/rules",
  globalRules_systemProvided = "/global/rules/system-provided",
  globalRules_userProvided = "/global/rules/user-provided",

  globalLabels = "/global/labels",
  globalLabels_systemProvided = "/global/labels/system-provided",
  globalLabels_userProvided = "/global/labels/user-provided",

  projects = "/projects",
  editProject = "/projects/~edit/:project",

  newProject = "/projects/~new",
  newProject_details = "/projects/~new/:project/project-details",
  newProject_addApplications = "/projects/~new/:project/add-appplications",
  newProject_setTransformationPath = "/projects/~new/:project/set-transformation-path",
  newProject_selectPackages = "/projects/~new/:project/select-packages",
  newProject_customRules = "/projects/~new/:project/custom-rules",
  newProject_customLabels = "/projects/~new/:project/custom-labels",
  newProject_advandedOptions = "/projects/~new/:project/advanced-options",
  newProject_review = "/projects/~new/:project/review",

  projectDetails = "/projects-details/:project",

  executions = "/projects-details/:project/analysis-results/executions",
  editExecution = "/projects-details/:project/analysis-results/executions/:execution",
  editExecution_overview = "/projects-details/:project/analysis-results/executions/:execution/overview",
  editExecution_applications = "/projects-details/:project/analysis-results/executions/:execution/applications",
  editExecution_rules = "/projects-details/:project/analysis-results/executions/:execution/rules",
  editExecution_logs = "/projects-details/:project/analysis-results/executions/:execution/logs",

  applications = "/projects-details/:project/applications",

  analysisConfiguration = "/projects-details/:project/analysis-configuration",
  analysisConfiguration_general = "/projects-details/:project/analysis-configuration/general",
  analysisConfiguration_packages = "/projects-details/:project/analysis-configuration/packages",
  analysisConfiguration_customRules = "/projects-details/:project/analysis-configuration/custom-rules",
  analysisConfiguration_customLabels = "/projects-details/:project/analysis-configuration/custom-labels",
  analysisConfiguration_advancedOptions = "/projects-details/:project/analysis-configuration/advanced-options",
}

export interface OptionalProjectRoute {
  project?: string;
}

export interface ProjectRoute {
  project: string;
}

export interface ProjectExecutionRoute extends ProjectRoute {
  execution: string;
}
