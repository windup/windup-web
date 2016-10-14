// Generated using typescript-generator version 1.10.212 on 2016-10-14 14:03:09.

export interface AdvancedOption {
    id: number;
    version: number;
    name: string;
    value: string;
}

export interface AdvancedOption_ {
}

export interface AnalysisContext {
    id: number;
    version: number;
    packages: string[];
    excludePackages: string[];
    migrationPath: MigrationPath;
    advancedOptions: AdvancedOption[];
    applicationGroup: ApplicationGroup;
    rulesPaths: RulesPath[];
}

export interface AnalysisContext_ {
}

export interface ApplicationGroup {
    id: number;
    version: number;
    readOnly: boolean;
    title: string;
    outputPath: string;
    migrationProject: MigrationProject;
    analysisContext: AnalysisContext;
    applications: RegisteredApplication[];
    executions: WindupExecution[];
}

export interface ApplicationGroup_ {
}

export interface Configuration {
    id: number;
    version: number;
    rulesPaths: RulesPath[];
}

export interface Configuration_ {
}

export interface MigrationPath {
    id: number;
    name: string;
    source: Technology;
    target: Technology;
}

export interface MigrationPath_ {
}

export interface MigrationProject {
    id: number;
    version: number;
    title: string;
}

export interface MigrationProject_ {
}

export interface RegisteredApplication {
    id: number;
    version: number;
    registrationType: RegistrationType;
    title: string;
    inputPath: string;
    reportIndexPath: string;
    applicationGroup: ApplicationGroup;
    inputFilename: string;
}

export interface RegisteredApplication_ {
}

export interface RuleEntity {
    id: number;
    version: number;
    ruleID: string;
    ruleContents: string;
}

export interface RuleEntity_ {
}

export interface RuleProviderEntity {
    id: number;
    version: number;
    providerID: string;
    origin: string;
    description: string;
    phase: string;
    dateLoaded: Calendar;
    dateModified: Calendar;
    sources: Technology[];
    targets: Technology[];
    rules: RuleEntity[];
    rulesPath: RulesPath;
    ruleProviderType: RuleProviderType;
}

export interface RuleProviderEntity_ {
}

export interface RulesPath {
    id: number;
    version: number;
    path: string;
    loadError: string;
    rulesPathType: RulesPathType;
}

export interface RulesPath_ {
}

export interface Technology {
    id: number;
    version: number;
    name: string;
    versionRange: string;
}

export interface Technology_ {
}

export interface WindupExecution {
    id: number;
    version: number;
    timeStarted: Calendar;
    timeCompleted: Calendar;
    outputPath: string;
    totalWork: number;
    workCompleted: number;
    currentTask: string;
    lastModified: Calendar;
    state: ExecutionState;
    analysisContext: AnalysisContext;
    applicationListRelativePath: string;
    outputDirectoryName: string;
}

export interface WindupExecution_ {
}

export interface Calendar extends Cloneable, Comparable<Calendar> {
}

export interface Cloneable {
}

export interface Comparable<T> {
}

export type ExecutionState = "QUEUED" | "STARTED" | "COMPLETED" | "FAILED" | "CANCELLED";

export type RegistrationType = "UPLOADED" | "PATH";

export type RuleProviderType = "JAVA" | "XML" | "GROOVY";

export type RulesPathType = "SYSTEM_PROVIDED" | "USER_PROVIDED";
