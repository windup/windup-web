import windupLogo from "images/windup-logo.svg";
import mtaLogo from "images/mta-logo.svg";
import tackleLogo from "images/tackle-logo.png";
import mtrLogo from "images/mtr-logo.svg";

import windupNavBrandImage from "images/windup-logo-header.svg";
import mtaNavBrandImage from "images/mta-logo-header.svg";
import tackleNavBrandImage from "images/tackle-logo-header.svg";
import mtrNavBrandImage from "images/mtr-logo-header.svg";

import windupFavicon from "images/windup-favicon.png";
import mtaFavicon from "images/mta-favicon.png";
import tackleFavicon from "images/tackle-favicon.png";
import mtrFavicon from "images/mtr-favicon.png";

import virtualServer from "images/Icon-Red_Hat-Virtual_server_stack-A-Red-RGB.png";
import {
  CAMEL,
  CONTAINERIZATION,
  DEFAULT_TRANSFORMATION_PATHS,
  EAP7,
  JAKARTA9,
  LINUX,
  OPENJDK,
  OPEN_LIBERTY,
  ORACLE_TO_OPENJDK,
  QUARKUS,
  RH_RUNTIMES,
  TransformationPathOption,
} from "./TransformationPaths";

const MTA_MTR_TRANSFORMATION_PATHS = [
  EAP7,
  CONTAINERIZATION,
  QUARKUS,
  ORACLE_TO_OPENJDK,
  OPENJDK,
  LINUX,
  JAKARTA9,
  RH_RUNTIMES,
  OPEN_LIBERTY,
  {
    label: "Azure",
    description:
      "Upgrade your Java application so that it can be deployed on Azure App Service.",
    options: "azure-appservice",
    iconSrc: virtualServer,
  },
  CAMEL,
];

//

export const PFTheme: "light" | "dark" = "dark";

type ThemeType = "windup" | "mta" | "tackle" | "mtr";
type ThemeListType = {
  [key in ThemeType]: {
    name: string;
    logoSrc: string;
    logoNavbarSrc: string;
    faviconSrc: string;
    websiteURL: string;
    documentationURL: string;
    transformationPaths: TransformationPathOption[];
  };
};

const themeList: ThemeListType = {
  windup: {
    name: "Windup",
    logoSrc: windupLogo,
    logoNavbarSrc: windupNavBrandImage,
    faviconSrc: windupFavicon,
    websiteURL: "https://windup.github.io/",
    documentationURL: "https://windup.github.io/",
    transformationPaths: [...DEFAULT_TRANSFORMATION_PATHS],
  },
  mta: {
    name: "Migration Toolkit for Applications",
    logoSrc: mtaLogo,
    logoNavbarSrc: mtaNavBrandImage,
    faviconSrc: mtaFavicon,
    websiteURL: "https://developers.redhat.com/products/mta/overview/",
    documentationURL:
      "https://access.redhat.com/documentation/en-us/migration_toolkit_for_applications/",
    transformationPaths: [...MTA_MTR_TRANSFORMATION_PATHS],
  },
  tackle: {
    name: "Tackle Analysis",
    logoSrc: tackleLogo,
    logoNavbarSrc: tackleNavBrandImage,
    faviconSrc: tackleFavicon,
    websiteURL: "https://konveyor.github.io/tackle/",
    documentationURL: "https://konveyor.github.io/tackle/",
    transformationPaths: [...DEFAULT_TRANSFORMATION_PATHS],
  },
  mtr: {
    name: "Migration Toolkit for Runtimes",
    logoSrc: mtrLogo,
    logoNavbarSrc: mtrNavBrandImage,
    faviconSrc: mtrFavicon,
    websiteURL: "https://developers.redhat.com/products/mtr/overview/",
    documentationURL:
      "https://access.redhat.com/documentation/en-us/migration_toolkit_for_runtimes/",
    transformationPaths: [...MTA_MTR_TRANSFORMATION_PATHS],
  },
};

export const Theme =
  themeList[(process.env.REACT_APP_THEME as ThemeType) || "windup"];
