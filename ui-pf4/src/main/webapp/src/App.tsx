import React, { useEffect } from "react";
import { HashRouter } from "react-router-dom";

import { AppRoutes } from "./Routes";

import "./App.scss";

import { DefaultLayout } from "./layout";

import DeleteDialog from "./containers/delete-dialog";
import { RuleLabelDetailsModal } from "./containers/rule-label-details-modal";

import NotificationsPortal from "@redhat-cloud-services/frontend-components-notifications/cjs/NotificationPortal";
import "@redhat-cloud-services/frontend-components-notifications/index.css";
import { Theme } from "layout/ThemeUtils";

const App: React.FC = () => {
  useEffect(() => {
    document.title = Theme.name;

    const favicon: any = document.querySelector("link[name='favicon']");
    if (favicon && Theme.faviconSrc) {
      favicon.href = Theme.faviconSrc;
    }
  }, []);

  return (
    <HashRouter>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      <NotificationsPortal />
      <DeleteDialog />
      <RuleLabelDetailsModal />
    </HashRouter>
  );
};

export default App;
