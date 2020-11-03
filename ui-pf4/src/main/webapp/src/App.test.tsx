import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { initApi } from "api/apiInit";

import App from "./App";
import configureStore from "./store";

it("renders without crashing", () => {
  const div = document.createElement("div");

  initApi();

  ReactDOM.render(
    <Provider store={configureStore()}>
      <App />,
    </Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
