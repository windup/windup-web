import { AxiosPromise } from "axios";

import { getWindupRestBase } from "Constants";
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
  ConfigurationOption,
  AdvancedOption,
  ValidationResult,
  WindupExecution,
  WindupVersion,
} from "models/api";

export const WINDUP_CORE_VERSION_URL = "/windup/coreVersion";

export const MIGRATION_PROJECTS_PATH = "/migrationProjects";

export const UPLOAD_APPLICATION_PATH = `${MIGRATION_PROJECTS_PATH}/:projectId/registeredApplications/upload`;

export const UPLOAD_RULE_TO_MIGRATION_PROJECT = `rules/upload/by-project/:projectId`;
export const UPLOAD_LABEL_TO_MIGRATION_PROJECT = `labels/upload/by-project/:projectId`;

export const UPLOAD_RULE_GLOBALLY = "rules/upload";
export const UPLOAD_LABEL_GLOBALLY = "labels/upload";

export const EXECUTION_PROGRESS_URL =
  "/websocket/execution-progress/:executionId";

export const DOWNLOAD_REGISTERED_APPLICATION = `registeredApplications/download`;

const defaultConfig = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const getWindupVersion = (): AxiosPromise<WindupVersion> => {
  return ApiClient.get(WINDUP_CORE_VERSION_URL);
};

export const getDownloadRegisteredApplicationURL = (
  applicationId: string | number
) => {
  return `${getWindupRestBase()}/${DOWNLOAD_REGISTERED_APPLICATION}/${applicationId}`;
};

export const getProjects = (): AxiosPromise<Project[]> => {
  return ApiClient.get<Project[]>(`${MIGRATION_PROJECTS_PATH}/list`);
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
  projectId: number | string,
  path: string,
  isPathExploded: boolean
): AxiosPromise<Application> => {
  return ApiClient.post<Application>(
    `${MIGRATION_PROJECTS_PATH}/${projectId}/registeredApplications/register-path?exploded=${isPathExploded}`,
    path,
    defaultConfig
  );
};

export const registerApplicationInDirectoryByPath = (
  projectId: number | string,
  path: string
): AxiosPromise<Application> => {
  return ApiClient.post<Application>(
    `${MIGRATION_PROJECTS_PATH}/${projectId}/registeredApplications/register-directory-path`,
    path,
    defaultConfig
  );
};

export const pathExists = (path: string): AxiosPromise<boolean> => {
  return ApiClient.post<boolean>("file/pathExists", path, defaultConfig);
};

export const pathTargetType = (
  path: string
): AxiosPromise<"FILE" | "DIRECTORY"> => {
  return ApiClient.post<"FILE" | "DIRECTORY">(
    "file/pathTargetType",
    path,
    defaultConfig
  );
};

export const getAnalysisContext = (
  analysisContextId: number | string
): AxiosPromise<AnalysisContext> => {
  return ApiClient.get<AnalysisContext>(
    `analysis-context/${analysisContextId}`
  );
};

export const saveAnalysisContext = (
  projectId: number | string,
  analysisContext: AnalysisContext,
  skipChangeToProvisional: boolean
): AxiosPromise<AnalysisContext> => {
  return ApiClient.put<AnalysisContext>(
    `analysis-context/migrationProjects/${projectId}?skipChangeToProvisional=${skipChangeToProvisional}`,
    analysisContext
  );
};

export const getGlobalConfiguration = (): AxiosPromise<Configuration> => {
  return ApiClient.get<Configuration>("configuration");
};

export const getProjectConfiguration = (
  projectId: number | string
): AxiosPromise<Configuration> => {
  return ApiClient.get<Configuration>(`configuration/by-project/${projectId}`);
};

export const updateConfiguration = (
  configuration: Configuration
): AxiosPromise<Configuration> => {
  return ApiClient.put<Configuration>(
    `configuration/${configuration.id}`,
    configuration
  );
};

export const reloadConfiguration = (
  configuration: Configuration
): AxiosPromise<Configuration> => {
  return ApiClient.post<Configuration>(
    `configuration/${configuration.id}/reload`,
    configuration.id,
    defaultConfig
  );
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
    `labels/by-labels-path/${rulesPathId}`
  );
};

export const isRulePathBeingUsed = (
  rulesPathId: number
): AxiosPromise<boolean> => {
  return ApiClient.get<boolean>(`rules/is-used-rules-path/${rulesPathId}`);
};

export const isLabelPathBeingUsed = (
  labelsPathId: number
): AxiosPromise<boolean> => {
  return ApiClient.get<boolean>(`labels/is-used-labels-path/${labelsPathId}`);
};

export const deleteRulePathById = (rulesPathId: number): AxiosPromise => {
  return ApiClient.delete(`rules/by-rules-path/${rulesPathId}`);
};

export const deleteLabelPathById = (labelsPathId: number): AxiosPromise => {
  return ApiClient.delete(`labels/by-labels-path/${labelsPathId}`);
};

export const getAdvancedConfigurationOptions = (
  analysisContext?: AnalysisContext
): AxiosPromise<ConfigurationOption[]> => {
  return ApiClient.get<ConfigurationOption[]>(
    `configuration-options?analysisContextId=${analysisContext?.id}`
  );
};

export const validateAdvancedOptionValue = (
  value: AdvancedOption,
  analysisContext?: AnalysisContext
): AxiosPromise<ValidationResult> => {
  return ApiClient.post<ValidationResult>(
    `configuration-options/validate-option?analysisContextId=${analysisContext?.id}`,
    value
  );
};

export const getProjectExecutions = (
  projectId: number | string
): AxiosPromise<WindupExecution[]> => {
  return ApiClient.get<WindupExecution[]>(`/windup/by-project/${projectId}`);
};

export const createProjectExecution = (
  projectId: number | string,
  analysisContext: AnalysisContext
): AxiosPromise<WindupExecution> => {
  return ApiClient.post<WindupExecution>(
    `/windup/execute-project-with-context/${projectId}`,
    analysisContext
  );
};

export const getExecution = (
  executionId: number | string
): AxiosPromise<WindupExecution> => {
  return ApiClient.get<WindupExecution>(`/windup/executions/${executionId}`);
};

export const getExecutionLog = (
  executionId: number | string
): AxiosPromise<string[]> => {
  return ApiClient.get<string[]>(`/windup/executions/${executionId}/logs`);
};

export const cancelExecution = (executionId: string | number): AxiosPromise => {
  return ApiClient.post(
    `/windup/executions/${executionId}/cancel`,
    undefined,
    defaultConfig
  );
};

export const deleteExecution = (executionId: string | number): AxiosPromise => {
  return ApiClient.delete(`/windup/executions/${executionId}`);
};
