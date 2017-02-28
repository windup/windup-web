declare interface Statistics{
    categoryId:string;
    categoryEffortIncidents: Map<string, number>;
}

declare interface PackageStatistics{
    //javaPackagesStats: Map<string, number>; 
    packageName: string;
    incidents: number;
}