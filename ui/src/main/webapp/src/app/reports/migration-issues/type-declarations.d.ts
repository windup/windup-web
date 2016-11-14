declare interface IssueLink {
    link: string;
    title: string;
}

declare interface ProblemSummary {
    id: string;
    severity: string; //Severity;
    ruleID: string;
    issueName: string;
    numberFound: number;
    effortPerIncident: number;
    links: IssueLink[];
    descriptions: string[];
}

declare interface ProblemSummaryMap {
    [category: string]: ProblemSummary;
}

declare interface Dictionary<T> {
    [index: string]: T;
}

declare interface IssuesPerFile {
    file: any;
    occurrences: number;
}
