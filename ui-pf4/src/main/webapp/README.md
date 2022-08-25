# WINDUP Web Console UI

UI based on [Patternfly 4](https://www.patternfly.org/v4/) and [ReactJS](https://reactjs.org/). This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

You need:

- NodeJS (version 12 or higher)
- Yarn

## Prepare the backend

You need to have WINDUP Web Console running. You can download it from [Red Hat Developers](https://developers.redhat.com/products/mta/download) or build it yourself from the source code following the instructions [building-the-windup-project](https://github.com/windup/windup-web#building-the-windup-project)

- Run the `$WINDUP_HOME/run_windup.sh` and wait until the server starts. Verify the server is running opening http://localhost:8080 in your browser.

> `$WINDUP_HOME` represents the folder where WINDUP Web Console is running.

## Prepare the UI

This step is only required if you have enabled authentication in the backend.

- Open the file `public/keycloak.json` and set manually the values of your Keycloak Server.
- Open the file `public/index.html` and configure the `window["windupConstants"]` variable. Replace `SSO_ENABLED: "${ssoEnabled}"` by `SSO_ENABLED: "true"` so it looks like:

```html
<script>
    window["mainApp"] = true;
    window["windupConstants"] = {
        SERVER: "${serverUrl}",
        REST_SERVER: "${serverUrl}",
        REST_BASE: "${apiServerUrl}",
        GRAPH_REST_BASE: "${graphApiServerUrl}",
        STATIC_REPORTS_BASE: "${staticReportServerUrl}",
        SSO_ENABLED: "true",
    };
</script>
```

## Run the UI in Dev mode

- Clone the repository https://github.com/windup/windup-web.git
- The source code of the UI is located in `ui-pf4/src/main/webapp` and you can open it with the IDE of your preference.
- Move your terminal to `ui-pf4/src/main/webapp` and execute `yarn install`
- In the same folder execute `yarn start`
- Open your browser in http://localhost:3000

That's all! Now you have the UI running in dev mode.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
