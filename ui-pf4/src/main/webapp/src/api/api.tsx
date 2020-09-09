import { AxiosPromise } from "axios";

import ApiClient from "./apiClient";
import {
  Project,
  MigrationProject,
  PackageMetadata,
  Application,
  AnalysisContext,
  Configuration,
  RulesPath,
  RuleProviderEntity,
  LabelProviderEntity,
  LabelsPath,
} from "models/api";

export const MIGRATION_PROJECTS_PATH = "/migrationProjects";
export const UPLOAD_APPLICATION_PATH = `${MIGRATION_PROJECTS_PATH}/:projectId/registeredApplications/upload`;
export const UPLOAD_RULE_TO_MIGRATION_PROJECT = `rules/upload/by-project/:projectId`;

export const getProjects = (): AxiosPromise<Project> => {
  return ApiClient.get<Project>(`${MIGRATION_PROJECTS_PATH}/list`);
};

export const getProjectIdByName = (
  name: string
): AxiosPromise<number | string> => {
  return ApiClient.get<number | string>(
    `${MIGRATION_PROJECTS_PATH}/id-by-name/${name}`
  );
};

export const getProjectById = (
  id: number | string
): AxiosPromise<MigrationProject> => {
  return ApiClient.get<MigrationProject>(
    `${MIGRATION_PROJECTS_PATH}/get/${id}`
  );
};

export const createProject = (
  project: MigrationProject
): AxiosPromise<MigrationProject> => {
  return ApiClient.put<MigrationProject>(
    `${MIGRATION_PROJECTS_PATH}/create`,
    project
  );
};

export const updateProject = (
  project: MigrationProject
): AxiosPromise<MigrationProject> => {
  return ApiClient.put<MigrationProject>(
    `${MIGRATION_PROJECTS_PATH}/update`,
    project
  );
};

export const deleteProject = (project: MigrationProject): AxiosPromise => {
  return ApiClient.delete(`${MIGRATION_PROJECTS_PATH}/delete`, {}, project);
};

export const deleteProvisionalProjects = (): AxiosPromise => {
  return ApiClient.delete(`${MIGRATION_PROJECTS_PATH}/deleteProvisional`);
};

export const uploadFileToProject = (
  projectId: number,
  formData: FormData,
  config = {}
): AxiosPromise => {
  return ApiClient.post(
    `${MIGRATION_PROJECTS_PATH}/${projectId}/registeredApplications/upload`,
    formData,
    config
  );
};

export const deleteRegisteredApplication = (applicationId: number) => {
  return ApiClient.delete(`registeredApplications/${applicationId}`);
};

export const getRegisteredApplicationPackages = (
  applicationId: number
): AxiosPromise<PackageMetadata> => {
  return ApiClient.get<PackageMetadata>(
    `registeredApplications/${applicationId}/packages`
  );
};

export const registerApplicationByPath = (
  projectId: number,
  path: string,
  isPathExploded: boolean
): AxiosPromise<Application> => {
  return ApiClient.post<Application>(
    `${MIGRATION_PROJECTS_PATH}/${projectId}/registeredApplications/register-path?exploded=${isPathExploded}`,
    path,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const registerApplicationInDirectoryByPath = (
  projectId: number,
  path: string
): AxiosPromise<Application> => {
  return ApiClient.post<Application>(
    `${MIGRATION_PROJECTS_PATH}/${projectId}/registeredApplications/register-directory-path`,
    path,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const pathExists = (path: string): AxiosPromise<boolean> => {
  return ApiClient.post<boolean>("file/pathExists", path, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const pathTargetType = (
  path: string
): AxiosPromise<"FILE" | "DIRECTORY"> => {
  return ApiClient.post<"FILE" | "DIRECTORY">("file/pathTargetType", path, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const getAnalysisContext = (
  analysisContextId: number
): AxiosPromise<AnalysisContext> => {
  return ApiClient.get<AnalysisContext>(
    `analysis-context/${analysisContextId}`
  );
};

export const saveAnalysisContext = (
  projectId: number,
  analysisContext: AnalysisContext
): AxiosPromise<AnalysisContext> => {
  return ApiClient.put<AnalysisContext>(
    `analysis-context/migrationProjects/${projectId}`,
    analysisContext
  );
};

export const getProjectConfiguration = (
  projectId: number | string
): AxiosPromise<Configuration> => {
  return ApiClient.get<Configuration>(`configuration/by-project/${projectId}`);
};

export const getRulesetPathsByConfigurationId = (
  configurationId: number
): AxiosPromise<RulesPath[]> => {
  return ApiClient.get<RulesPath[]>(
    `configuration/${configurationId}/custom-rulesets`
  );
};

export const getLabelsetPathsByConfigurationId = (
  configurationId: number
): AxiosPromise<LabelsPath[]> => {
  return ApiClient.get<LabelsPath[]>(
    `configuration/${configurationId}/custom-labelsets`
  );
};

export const getRuleProviderByRulesPathId = (
  rulesPathId: number
): AxiosPromise<RuleProviderEntity[]> => {
  return ApiClient.get<RuleProviderEntity[]>(
    `rules/by-rules-path/${rulesPathId}`
  );
};

export const getLabelProviderByLabelsPathId = (
  rulesPathId: number
): AxiosPromise<LabelProviderEntity[]> => {
  return ApiClient.get<LabelProviderEntity[]>(
    `rules/by-labels-path/${rulesPathId}`
  );
};

export const isRulePathBeingUsed = (
  rulesPathId: number
): AxiosPromise<boolean> => {
  return ApiClient.get<boolean>(`rules/is-used-rules-path/${rulesPathId}`);
};

export const deleteRulePathById = (rulesPathId: number): AxiosPromise => {
  return ApiClient.delete(`rules/by-rules-path/${rulesPathId}`);
};
