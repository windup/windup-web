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
  newProject_completition = "/projects/~new/:project",
  editProject = "/projects/:project",
  editProject_projectDetail = "/projects/:project/project-detail",
  editProject_applications = "/projects/:project/applications",
  editProject_analysisContext = "/projects/:project/analysis-context",
}
