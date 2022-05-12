import mtaLogo from "images/mta-logo.svg";
import tackleLogo from "images/tackle-logo.png";

import mtaNavBrandImage from "images/mta-logo-header.svg";
import tackleNavBrandImage from "images/tackle-logo-header.svg";
import tackleFavicon from "images/tackle-favicon.png";

export const PFTheme: "light" | "dark" = "dark";

type ThemeType = "mta" | "tackle";
type ThemeListType = {
  [key in ThemeType]: {
    name: string;
    logoSrc: string;
    logoNavbarSrc: string;
    faviconSrc?: string;
  };
};

const themeList: ThemeListType = {
  mta: {
    name: "Migration Toolkit for Applications",
    logoSrc: mtaLogo,
    logoNavbarSrc: mtaNavBrandImage,
  },
  tackle: {
    name: "Tackle Analysis",
    logoSrc: tackleLogo,
    logoNavbarSrc: tackleNavBrandImage,
    faviconSrc: tackleFavicon,
  },
};

export const Theme =
  themeList[(process.env.REACT_APP_THEME as ThemeType) || "mta"];
