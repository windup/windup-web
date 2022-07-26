import windupLogo from "images/windup-logo.svg";
import mtaLogo from "images/mta-logo.svg";
import tackleLogo from "images/tackle-logo.png";

import windupNavBrandImage from "images/windup-logo-header.svg";
import mtaNavBrandImage from "images/mta-logo-header.svg";
import tackleNavBrandImage from "images/tackle-logo-header.svg";

import windupFavicon from "images/windup-favicon.png";
import mtaFavicon from "images/mta-favicon.png";
import tackleFavicon from "images/tackle-favicon.png";

export const PFTheme: "light" | "dark" = "dark";

type ThemeType = "windup" | "mta" | "tackle";
type ThemeListType = {
  [key in ThemeType]: {
    name: string;
    logoSrc: string;
    logoNavbarSrc: string;
    faviconSrc: string;
    websiteURL: string;
    documentationURL: string;
  };
};

const themeList: ThemeListType = {
  windup: {
    name: "Windup Migration Toolkit for Applications",
    logoSrc: windupLogo,
    logoNavbarSrc: windupNavBrandImage,
    faviconSrc: windupFavicon,
    websiteURL: "https://windup.github.io/",
    documentationURL: "https://windup.github.io/",
  },
  mta: {
    name: "Migration Toolkit for Applications",
    logoSrc: mtaLogo,
    logoNavbarSrc: mtaNavBrandImage,
    faviconSrc: mtaFavicon,
    websiteURL: "https://developers.redhat.com/products/mta/overview/",
    documentationURL:
      "https://access.redhat.com/documentation/en-us/migration_toolkit_for_applications/",
  },
  tackle: {
    name: "Tackle Analysis",
    logoSrc: tackleLogo,
    logoNavbarSrc: tackleNavBrandImage,
    faviconSrc: tackleFavicon,
    websiteURL: "https://konveyor.github.io/tackle/",
    documentationURL: "https://konveyor.github.io/tackle/",
  },
};

export const Theme =
  themeList[(process.env.REACT_APP_THEME as ThemeType) || "windup"];
