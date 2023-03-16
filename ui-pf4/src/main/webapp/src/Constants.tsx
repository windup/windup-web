import { API_BASE_URL } from "api/apiInit";
import packageJson from "../package.json";

// Windup ENV configuration

interface WindupEnv {
  SERVER: string;
  REST_SERVER: string;
  REST_BASE: string;
  GRAPH_REST_BASE: string;
  STATIC_REPORTS_BASE: string;
  SSO_ENABLED: string;
}

export const WINDUP_WEB_VERSION: string =
  (window as any)["windupWebVersion"] || "";
export const WINDUP_WEB_SCM_REVISION: string =
  (window as any)["windupWebScmRevision"] || "";

export const WINDUP_ENV_VARIABLES: WindupEnv = (window as any)[
  "windupConstants"
];

export const MERGED_CSV_FILENAME = "AllIssues.csv";

export const getWindupRestBase = () => {
  let base = packageJson.proxy + API_BASE_URL; // Development
  if (process.env.NODE_ENV === "production") {
    base = WINDUP_ENV_VARIABLES.REST_BASE;
  }
  return base;
};

export const getWindupStaticReportsBase = () => {
  let base = packageJson.proxy + API_BASE_URL + "/static-report"; // Development
  if (process.env.NODE_ENV === "production") {
    base = WINDUP_ENV_VARIABLES.STATIC_REPORTS_BASE;
  }
  return base;
};

export const isSSOEnabled = () => {
  return WINDUP_ENV_VARIABLES.SSO_ENABLED === "true";
};

// Windup general variables

export const TARGET_EAP7 = "eap7";

export enum AdvancedOptionsFieldKey {
  // Dropdowns
  TARGET = "target",
  SOURCE = "source",
  // INCLUDE_TAGS = "includeTags",
  EXCLUDE_TAGS = "excludeTags",

  // Input texts
  ADDITIONAL_CLASSPATH = "additionalClasspath",
  APPLICATION_NAME = "inputApplicationName",
  MAVENIZE_GROUP_ID = "mavenizeGroupId",
  IGNORE_PATH = "userIgnorePath",

  // Switch
  EXPORT_CSV = "exportCSV",
  TATTLETALE = "disableTattletale",
  CLASS_NOT_FOUND_ANALYSIS = "enableClassNotFoundAnalysis",
  COMPATIBLE_FILES_REPORT = "enableCompatibleFilesReport",
  EXPLODED_APP = "explodedApp",
  KEEP_WORK_DIRS = "keepWorkDirs",
  SKIP_REPORTS = "skipReports",
  SKIP_SOURCE_CODE_REPORTS = "skipSourceCodeReports",
  ALLOW_NETWORK_ACCESS = "online",
  MAVENIZE = "mavenize",
  SOURCE_MODE = "sourceMode",
  ANALYZE_KNOWN_LIBRARIES = "analyzeKnownLibraries",
  TRANSTRACTION_ANALYSIS = "enableTransactionAnalysis",
}

//

export class Constants {
  static readonly DEFAULT_PAGE_SIZE = 10;
  static readonly DEFAULT_PAGINATION_OPTIONS = [10, 20, 50, 100];
  static readonly ALLOWED_APPLICATION_EXTENSIONS =
    ".ear, .har, .jar, .rar, .sar, .war, .zip";
}

export const getAlertModel = (
  variant: "danger",
  title: string,
  message: string
) => ({
  variant: variant,
  title: title,
  description: message,
});

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
