import appOnServer from "images/Icon-Red_Hat-App_on_server-A-Red-RGB.svg";
import cloud from "images/Icon-Red_Hat-Cloud-A-Red-RGB.svg";
import migration from "images/Icon-Red_Hat-Migration-A-Red-RGB.svg";
import mug from "images/Icon-Red_Hat-Mug-A-Red-RGB.svg";
import multiply from "images/Icon-Red_Hat-Multiply-A-Red-RGB.svg";
import server from "images/Icon-Red_Hat-Server-A-Red-RGB.svg";
import virtualServer from "images/Icon-Red_Hat-Virtual_server_stack-A-Red-RGB.png";
import search from "images/UI_Icon-Red_Hat-Search-A-Red-RGB.svg";

export interface MultipleOptions {
  label: string;
  value: string;
  default: boolean;
}

export interface TransformationPathOption {
  label: string;
  description?: string;
  options: string | MultipleOptions[];
  icon?: React.ComponentType<any>;
  iconSrc?: string;
  isNew?: boolean;
}

export const EAP7: TransformationPathOption = {
  label: "Application server migration to EAP",
  description:
    "Upgrade to the latest Release of EAP 7, or EAP 8, or migrate your applications to JBoss EAP from a competitor's Enterprise Application server.",
  options: [
    {
      label: "JBoss EAP 7",
      value: "eap7",
      default: true,
    },
    {
      label: "JBoss EAP 8",
      value: "eap8",
      default: false,
    },
  ],
  iconSrc: appOnServer,
};

export const CONTAINERIZATION: TransformationPathOption = {
  label: "Containerization",
  description:
    "A comprehensive set of cloud and container readiness rules to assess applications for suitability for deployment on OpenShift Container Platform.",
  options: "cloud-readiness",
  iconSrc: cloud,
};

export const QUARKUS: TransformationPathOption = {
  label: "Quarkus",
  description:
    "Rules to support the migration of Spring Boot applications to Quarkus. The rules also identify other, non-Spring Boot,  technologies embedded within applications for which there are equivalent Quarkus extensions.",
  options: "quarkus",
  iconSrc: migration,
};

export const ORACLE_TO_OPENJDK: TransformationPathOption = {
  label: "OracleJDK to OpenJDK",
  description: "Rules to support the migration to OpenJDK from OracleJDK.",
  options: "openjdk",
  iconSrc: mug,
};

export const OPENJDK: TransformationPathOption = {
  label: "OpenJDK",
  description:
    "Rules to support upgrading the version of OpenJDK. Migrate to OpenJDK 11, OpenJDK 17 or OpenJDK 21.",
  options: [
    {
      label: "OpenJDK 11",
      value: "openjdk11",
      default: false,
    },
    {
      label: "OpenJDK 17",
      value: "openjdk17",
      default: true,
    },
    {
      label: "OpenJDK 21",
      value: "openjdk21",
      default: false,
    },
  ],
  iconSrc: mug,
};

export const LINUX: TransformationPathOption = {
  label: "Linux",
  description:
    "Ensure that there are no Microsoft Windows paths hard coded and no Dynamic-Link Library (DLL) into your applications.",
  options: "linux",
  iconSrc: server,
};

export const JAKARTA9: TransformationPathOption = {
  label: "Jakarta EE 9",
  description:
    "A collection of rules to support migrating applications from Java EE 8 to Jakarta EE 9 (and above). The rules cover project dependencies, package renaming, updating XML Schema namespaces, the renaming of application configuration properties and bootstrapping files.",
  options: "jakarta-ee",
  iconSrc: migration,
};
export const JWS6: TransformationPathOption = {
  label: "JBoss Web Server 6",
  description:
    "A collection of rules to support migrating applications from JWS 5 to JWS 6",
  options: "jws6",
  iconSrc: appOnServer,
  isNew: false,
};
export const RH_RUNTIMES: TransformationPathOption = {
  label: "Spring Boot on Red Hat Runtimes",
  description:
    "A set of rules for assessing the compatibility of applications against versions of Spring Boot libraries supported by Red Hat Runtimes.",
  options: "rhr",
  iconSrc: migration,
};

export const OPEN_LIBERTY: TransformationPathOption = {
  label: "Open Liberty",
  description:
    "A comprehensive set of rules for migrating traditional WebSphere applications to Open Liberty.",
  options: "openliberty",
  iconSrc: migration,
};

export const AZURE: TransformationPathOption = {
  label: "Azure",
  description:
    "Upgrade your Java application so it can be deployed in different flavors of Azure.",
  options: [
    {
      label: "azure-appservice",
      value: "azure-appservice",
      default: true,
    },
    {
      label: "azure-aks",
      value: "azure-aks",
      default: false,
    },
    {
      label: "azure-container-apps",
      value: "azure-container-apps",
      default: false,
    },
    {
      label: "azure-spring-apps",
      value: "azure-spring-apps",
      default: false,
    },
  ],
  iconSrc: virtualServer,
};

export const CAMEL: TransformationPathOption = {
  label: "Camel",
  description: "Rules to support upgrading to a newer version of Camel.",
  options: Array.from({ length: 22 }, (_, index) => `3.${index}`)
    .concat(["4.0"])
    .map((version) => ({
      label: `camel:${version}`,
      value: `camel:${version}`,
      default: version === "3.21",
    })),
  iconSrc: multiply,
  isNew: false,
};

export const DISCOVERY: TransformationPathOption = {
  label: "Discovery",
  description:
    "It runs an analysis to just discover the technologies and frameworks used within the application(s).",
  options: "discovery",
  iconSrc: search,
  isNew: false,
};

export const DEFAULT_TRANSFORMATION_PATHS = [
  EAP7,
  CONTAINERIZATION,
  QUARKUS,
  ORACLE_TO_OPENJDK,
  OPENJDK,
  LINUX,
  JAKARTA9,
  JWS6,
  RH_RUNTIMES,
  OPEN_LIBERTY,
  AZURE,
  CAMEL,
  DISCOVERY,
];

export const MTA_MTR_TRANSFORMATION_PATHS = [
  EAP7,
  CONTAINERIZATION,
  QUARKUS,
  ORACLE_TO_OPENJDK,
  OPENJDK,
  LINUX,
  JAKARTA9,
  JWS6,
  RH_RUNTIMES,
  OPEN_LIBERTY,
  {
    ...AZURE,
    description:
      "Upgrade your Java application so that it can be deployed on Azure App Service.",
    options: "azure-appservice",
  },
  CAMEL,
  DISCOVERY,
];
