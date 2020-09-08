import ApiClient from "./apiClient";
import { AxiosPromise } from "axios";
import {
  Project,
  MigrationProject,
  PackageMetadata,
  Application,
  AnalysisContext,
} from "models/api";

const MIGRATION_PROJECTS = "/migrationProjects";

export const getProjects = (): AxiosPromise<Project> => {
  return ApiClient.get<Project>(`${MIGRATION_PROJECTS}/list`);
};

export const getProjectIdByName = (
  name: string
): AxiosPromise<number | string> => {
  return ApiClient.get<number | string>(
    `${MIGRATION_PROJECTS}/id-by-name/${name}`
  );
};

export const getProjectById = (
  id: number | string
): AxiosPromise<MigrationProject> => {
  return ApiClient.get<MigrationProject>(`${MIGRATION_PROJECTS}/get/${id}`);
};

export const createProject = (
  project: MigrationProject
): AxiosPromise<MigrationProject> => {
  return ApiClient.put<MigrationProject>(
    `${MIGRATION_PROJECTS}/create`,
    project
  );
};

export const updateProject = (
  project: MigrationProject
): AxiosPromise<MigrationProject> => {
  return ApiClient.put<MigrationProject>(
    `${MIGRATION_PROJECTS}/update`,
    project
  );
};

export const deleteProject = (project: MigrationProject): AxiosPromise => {
  return ApiClient.delete(`${MIGRATION_PROJECTS}/delete`, {}, project);
};

export const deleteProvisionalProjects = (): AxiosPromise => {
  return ApiClient.delete(`${MIGRATION_PROJECTS}/deleteProvisional`);
};

export const uploadFileToProject = (
  projectId: number,
  formData: FormData,
  config = {}
): AxiosPromise => {
  return ApiClient.post(
    `${MIGRATION_PROJECTS}/${projectId}/registeredApplications/upload`,
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
    `${MIGRATION_PROJECTS}/${projectId}/registeredApplications/register-path?exploded=${isPathExploded}`,
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
    `${MIGRATION_PROJECTS}/${projectId}/registeredApplications/register-directory-path`,
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
