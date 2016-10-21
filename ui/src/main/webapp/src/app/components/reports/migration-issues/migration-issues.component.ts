import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute} from "@angular/router";
import {NotificationService} from "../../../services/notification.service";
import {MigrationIssuesService} from "./migration-issues.service";

@Component({
    selector: 'wu-migration-issues',
    templateUrl: '/migration-issues.component.html',
    styles: [
        `a { cursor: pointer; }`
    ]
})
export class MigrationIssuesComponent implements OnInit {
    protected categorizedIssues: Dictionary<ProblemSummary[]>;
    protected categories: string[];

    public constructor(
        private _router: Router,
        private _activatedRoute: ActivatedRoute,
        private _migrationIssuesService: MigrationIssuesService,
        private _notificationService: NotificationService
    ) {
        this.categorizedIssues = MIGRATION_ISSUES__TEMP;
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe(params => {
            let executionId = parseInt(params['id']);

            this._migrationIssuesService.getAggregatedIssues(executionId).subscribe(
                result => {
                    this.categorizedIssues = result;
                    this.categories = Object.keys(result);
                },
                error => {
                    this._notificationService.error(error);
                    this._router.navigate(['']);
                });
        });
    }
}

const MIGRATION_ISSUES__TEMP = {
    "Mandatory": [
        {
            "id": "e9b8d30d-d747-483f-8918-30d5d4b7f00f",
            "severity": "Mandatory",
            "ruleID": "os-specific-00001",
            "issueName": "Windows file system path",
            "numberFound": 10,
            "effortPerIncident": 1,
            "links": [],
            "descriptions": [
                "This file system path is Windows platform dependent. It needs to be replaced with a Linux-style path."
            ]
        }
    ],
    "Optional": [
        {
            "id": "c5cda781-cac9-4d25-9828-cee58816013f",
            "severity": "Optional",
            "ruleID": "jboss-eap5-xml-10000",
            "issueName": "JBoss 5 classloader configuration (jboss-classloading.xml)",
            "numberFound": 2,
            "effortPerIncident": 0,
            "links": [
                {
                    "link": "https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6.4/html/Development_Guide/chap-Class_Loading_and_Modules.html",
                    "title": "JBoss EAP 6 Class Loading and Modules"
                }
            ],
            "descriptions": [
                "In JBoss EAP 6, the classloading configuration is not done through `jboss-classloading.xml`.\nSince EAP 6 it is of modular nature, based on JBoss Modules.\nLearn how to divide your application's dependencies into modules\nand what dependencies and APIs are available automatically.",
                "The `jboss-classloading.xml` file allows customization of classloading in JBoss EAP 5."
            ]
        },
        {
            "id": "18eba363-4a3b-4ef0-b867-3c50ca3d7df9",
            "severity": "Optional",
            "ruleID": "jboss-eap5-7-xml-10000",
            "issueName": "JBoss 5 classloader configuration (jboss-classloading.xml)",
            "numberFound": 1,
            "effortPerIncident": 0,
            "links": [
                {
                    "link": "https://access.redhat.com/documentation/en/red-hat-jboss-enterprise-application-platform/7.0/paged/development-guide/chapter-3-class-loading-and-modules",
                    "title": "JBoss EAP 7 Class Loading and Modules"
                }
            ],
            "descriptions": [
                "In JBoss EAP 6, the classloading configuration is not done through `jboss-classloading.xml`.\nSince EAP 6 it is of modular nature, based on JBoss Modules.\nLearn how to divide your application's dependencies into modules\nand what dependencies and APIs are available automatically."
            ]
        },
        {
            "id": "e95949e4-e54b-4e62-b77d-e3b979c61756",
            "severity": "Optional",
            "ruleID": "weblogic-catchall-06500",
            "issueName": "Oracle proprietary JDBC type reference",
            "numberFound": 18,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                "This is an Oracle proprietary JDBC type (`oracle.sql.driver.OracleConnection`).\n\nIt should be replaced by standard Java EE JCA, datasource and JDBC types."
            ]
        },
        {
            "id": "43ece53c-7db3-48e9-bb65-483471e5bb6e",
            "severity": "Optional",
            "ruleID": "DiscoverWebXmlRuleProvider_1",
            "issueName": "Web XML",
            "numberFound": 1,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                " Web Application Deployment Descriptors"
            ]
        },
        {
            "id": "1a036654-87ef-4f70-bd72-295cc6a2afae",
            "severity": "Optional",
            "ruleID": "jboss-eap5-xml-04000",
            "issueName": "JBoss EAP 5 Classloading Configuration",
            "numberFound": 1,
            "effortPerIncident": 5,
            "links": [
                {
                    "link": "https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/5/html/Microcontainer_User_Guide/sect-JBoss_Microcontainer_User_Guide-The_ClassLoading_Layer-ClassLoading.html",
                    "title": "JBoss EAP 5 Classloading documentation"
                }
            ],
            "descriptions": [
                "JBoss EAP 5 allows detailed classloading configuration."
            ]
        },
        {
            "id": "52297c31-2ef0-4469-a28e-694ec6bd5508",
            "severity": "Optional",
            "ruleID": "jboss-eap5-xml-09000",
            "issueName": "JBoss web application descriptor (jboss-web.xml)",
            "numberFound": 1,
            "effortPerIncident": 1,
            "links": [],
            "descriptions": [
                "The `jboss-web.xml` file configures a Java EE web application specifically for JBoss EAP.\n                        It is an extension to standard `web.xml`."
            ]
        },
        {
            "id": "5818519a-a8ac-4814-ba5e-bdc572008129",
            "severity": "Optional",
            "ruleID": "DiscoverMavenProjectsRuleProvider_1",
            "issueName": "Maven POM",
            "numberFound": 1,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                "Maven Project Object Model (POM) File"
            ]
        }
    ],
    "Potential Issues": [
        {
            "id": "e10f1046-a483-4871-82a8-be85a669a0fa",
            "severity": "Potential Issues",
            "ruleID": "generic-catchall-00700",
            "issueName": "JBoss API reference",
            "numberFound": 18,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                "`org.jboss.resource.adapter.jdbc.WrappedConnection` reference found. No specific details available."
            ]
        },
        {
            "id": "9226ef94-f723-479e-a0f6-1656abffada3",
            "severity": "Potential Issues",
            "ruleID": "weblogic-catchall-06000",
            "issueName": "Oracle proprietary SQL type reference",
            "numberFound": 35,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                "This is an Oracle proprietary SQL type (`oracle.sql.ArrayDescriptor`).\n\nIn most of the cases, it does not need to be migrated to a compatible API.",
                "This is an Oracle proprietary SQL type (`oracle.sql.ARRAY`).\n\nIn most of the cases, it does not need to be migrated to a compatible API.",
                "This is an Oracle proprietary SQL type (`oracle.sql.ArrayDescriptor.createDescriptor(java.lang.String, oracleConn)`).\n\nIn most of the cases, it does not need to be migrated to a compatible API."
            ]
        },
        {
            "id": "7a3bce01-eaa0-454e-b3ec-8615f3dba90c",
            "severity": "Potential Issues",
            "ruleID": "weblogic-catchall-07000",
            "issueName": "Oracle proprietary type reference",
            "numberFound": 19,
            "effortPerIncident": 0,
            "links": [],
            "descriptions": [
                "This is an Oracle proprietary type (`oracle.xdb.XMLType`) and needs to be migrated to a compatible API. There is currently no detailed information about this type.",
                "This is an Oracle proprietary type (`oracle.xdb.XMLType.createXML(oracleConn, java.lang.String)`) and needs to be migrated to a compatible API. There is currently no detailed information about this type."
            ]
        }
    ]
};

