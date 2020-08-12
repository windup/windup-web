import ApiClient from "./apiClient";
import { AxiosPromise } from "axios";
import { Project } from "../models/api";

const MIGRATION_PROJECTS = "/migrationProjects";

export const getProjects = (): AxiosPromise<Project> => {
  return ApiClient.get<Project>(`${MIGRATION_PROJECTS}/list`);
};
