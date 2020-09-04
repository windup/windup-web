import ApiClient from "./apiClient";
import { AxiosPromise } from "axios";
import { Project, MigrationProject, PackageMetadata } from "models/api";

const MIGRATION_PROJECTS = "/migrationProjects";

export const getProjects = (): AxiosPromise<Project> => {
  return ApiClient.get<Project>(`${MIGRATION_PROJECTS}/list`);
};

export const getProjectIdByName = (name: string): AxiosPromise<number> => {
  return ApiClient.get<number>(`${MIGRATION_PROJECTS}/id-by-name/${name}`);
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
