import ApiClient from "./apiClient";
import { AxiosPromise } from "axios";
import { Project, MigrationProject } from "../models/api";

const MIGRATION_PROJECTS = "/migrationProjects";

export const getProjects = (): AxiosPromise<Project> => {
  return ApiClient.get<Project>(`${MIGRATION_PROJECTS}/list`);
};

export const deleteProject = (project: MigrationProject) => {
  return ApiClient.delete(`${MIGRATION_PROJECTS}/delete`, {}, project);
};

export function uploadFileToProject(
  id: number,
  formData: FormData,
  config = {}
): AxiosPromise {
  return ApiClient.post(
    `${MIGRATION_PROJECTS}/${id}/registeredApplications/upload`,
    formData,
    config
  );
}
