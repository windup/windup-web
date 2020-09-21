export type ExecutionState =
  | "QUEUED"
  | "STARTED"
  | "COMPLETED"
  | "FAILED"
  | "CANCELLED";

export type LabelProviderType = "XML";

export type ScanStatus = "QUEUED" | "IN_PROGRESS" | "COMPLETE";

export type PathType = "SYSTEM_PROVIDED" | "USER_PROVIDED";

export type RegistrationType = "UPLOADED" | "PATH";

export type RuleProviderType = "JAVA" | "XML" | "GROOVY";

export type ScopeType = "GLOBAL" | "PROJECT";

export interface Project {
  activeExecutionsCount: number;
  applicationCount: number;
  isDeletable: boolean;
  migrationProject: MigrationProject;
}

export interface MigrationProject {
  id: number;
  title: string;
  description: string;
  defaultAnalysisContextId: number;
  provisional: boolean;
  created: Date;
  lastModified: Date;
  applications: Application[];
}

export interface Application {
  id: number;
  deleted: boolean;
  exploded: boolean;
  fileSize: number;
  inputFilename: string;
  inputPath: string;
  created: Date;
  lastModified: Date;
  registrationType: "PATH" | "UPLOADED";
  reportIndexPath: null;
  title: string;
}

export interface Package {
  id: number;
  name: string;
  fullName: string;
  level: number;
  known: boolean;
  countClasses: number;
  childs: Package[];
}

export interface PackageMetadata {
  id: number;
  discoveredDate: Date;
  scanStatus: ScanStatus;
  packageTree: Package[];
}

export interface AnalysisContext {
  id: number;
  version: number;
  generateStaticReports: boolean;
  cloudTargetsIncluded: boolean;
  linuxTargetsIncluded: boolean;
  openJdkTargetsIncluded: boolean;
  transformationPaths: string[];
  // migrationPath: MigrationPath;
  advancedOptions: AdvancedOption[];
  rulesPaths: RulesPath[];
  labelsPaths: LabelsPath[];
  includePackages: Package[];
  excludePackages: Package[];
  // applications: RegisteredApplication[];
}

export interface Configuration {
  id: number;
  global: boolean;
  version: number;
  rulesPaths: RulesPath[];
  labelsPaths: LabelsPath[];
}

export interface RulesPath {
  id: number;
  version: number;
  path: string;
  scanRecursively: boolean;
  shortPath: string;
  loadError: string;
  rulesPathType: PathType;
  registrationType: RegistrationType;
  scopeType: ScopeType;
}

export interface LabelsPath {
  id: number;
  version: number;
  path: string;
  scanRecursively: boolean;
  shortPath: string;
  loadError: string;
  labelsPathType: PathType;
  registrationType: RegistrationType;
  scopeType: ScopeType;
}

export interface RuleProviderEntity {
  id: number;
  version: number;
  providerID: string;
  origin: string;
  description: string;
  phase: string;
  dateLoaded: Date;
  dateModified: Date;
  sources: Technology[];
  targets: Technology[];
  rules: RuleEntity[];
  rulesPath: RulesPath;
  tags: Tag[];
  loadError: string;
  ruleProviderType: RuleProviderType;
}
export interface LabelProviderEntity {
  id: number;
  version: number;
  providerID: string;
  origin: string;
  description: string;
  dateLoaded: Date;
  dateModified: Date;
  labels: LabelEntity[];
  labelsPath: LabelsPath;
  loadError: string;
  labelProviderType: LabelProviderType;
}

export interface RuleEntity {
  id: number;
  version: number;
  ruleID: string;
  ruleContents: string;
}

export interface LabelEntity {
  id: number;
  version: number;
  labelID: string;
  labelContents: string;
}

export interface Technology {
  id: number;
  version: number;
  name: string;
  versionRange: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  title: string;
  containedTags: Tag[];
  root: boolean;
  pseudo: boolean;
}

export interface ConfigurationOption {
  /**
   * Returns the name of the parameter. This should be a short name that is suitable for use in a command line parameter (for example, "packages" or
   * "excludePackages").
   */
  name: string;

  /**
   * Return a short amount of descriptive text regarding the option (for example, "Exclude Packages").
   */
  label: string;

  /**
   * Returns descriptive text that may be more lengthy and descriptive (for example, "Excludes the specified Java packages from Windup's scans").
   */
  description: string;

  /**
   * Returns the datatype for this Option (typically File, String, or List<String>).
   */
  type: string;

  /**
   * Returns a type that can be used as a hint to indicate what type of user interface should be presented for this option.
   */
  uitype: string;

  /**
   * Indicates whether or not this option must be specified.
   */
  required: boolean;

  /**
   * Default value for this option (if not set by user).
   */
  defaultValue: any;

  /**
   * Returns an ordered list of available values.
   */
  availableValues: any[];

  /**
   * Indicates the "priority" of this option. Higher values (and therefore higher priority) of this value will result in the item being asked
   * earlier than items with a lower priority value.
   */
  priority: number;
}

export interface AdvancedOption {
  id: number;
  version: number;
  name: string;
  value: string | boolean;
}

export type LevelType = "ERROR" | "PROMPT_TO_CONTINUE" | "WARNING" | "SUCCESS";

export interface ValidationResult {
  level: LevelType;
  message: string;
}
