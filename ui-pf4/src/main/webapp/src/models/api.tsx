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
  scanStatus: "QUEUED" | "IN_PROGRESS" | "COMPLETE";
  packageTree: Package[];
}
