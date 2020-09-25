import { API_BASE_URL } from "api/apiInit";
import packageJson from "../package.json";

interface WindupEnv {
  SERVER: string;
  REST_SERVER: string;
  REST_BASE: string;
  GRAPH_REST_BASE: string;
  STATIC_REPORTS_BASE: string;
  SSO_MODE: string;
}

export const WINDUP_ENV_VARIABLES: WindupEnv = (window as any)[
  "windupConstants"
];

export const getWindupRestBase = () => {
  // Development
  let base = packageJson.proxy + API_BASE_URL;

  // Production
  if (process.env.NODE_ENV === "production") {
    base = WINDUP_ENV_VARIABLES.REST_BASE;
  }

  return base;
};

export const getWindupStaticReportsBase = () => {
  // Development
  let base = packageJson.proxy + API_BASE_URL + "/static-report";

  // Production
  if (process.env.NODE_ENV === "production") {
    base = WINDUP_ENV_VARIABLES.STATIC_REPORTS_BASE;
  }

  return base;
};

//

export class Constants {
  static readonly DEFAULT_PAGE_SIZE = 10;
  static readonly DEFAULT_PAGINATION_OPTIONS = [10, 20, 50, 100];
}

export const getDeleteSuccessAlertModel = (type: string) => ({
  variant: "success",
  title: "Success",
  description: `${type} deleted successfully`,
});

export const getDeleteErrorAlertModel = (type: string) => ({
  variant: "danger",
  title: "Error",
  description: `Error while deleting ${type}`,
});
