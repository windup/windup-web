# MTA Web Console UI

UI based on [Patternfly 4](https://www.patternfly.org/v4/) and [ReactJS](https://reactjs.org/). This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Prerequisites

You need:

- NodeJS (version 12 or higher)
- Yarn

## Prepare the backend

You need to have MTA Web Console running. You can download it from [Red Hat Developers](https://developers.redhat.com/products/mta/download) or build it yourself from the source code following the instructions [building-the-windup-project](https://github.com/windup/windup-web#building-the-windup-project)

- Run the `$MTA_HOME/run_mta.sh` and wait until the server starts. Verify the server is running opening http://localhost:8080 in your browser.
- Configure Keycloak's client to have http://localhost:3000 as a valid redirect URI, folow the steps below to do it.

Login to Keycloak:

```shell
$MTA_HOME/bin/kcadm.sh config credentials \
--server http://localhost:8080/auth \
--realm master \
--user admin \
--password password \
--client admin-cli
```

Change Keycloak's client `mta-web`:

```shell
$MTA_HOME/bin/kcadm.sh update realms/mta/clients/739a78cd-ab8d-427a-93f7-4af38f0eab31 \
-s id="739a78cd-ab8d-427a-93f7-4af38f0eab31" \
-s clientId="mta-web" \
-s adminUrl="/mta-web" \
-s "redirectUris=[\"http://localhost:3000/*\", \"/mta-web/*\", \"/mta-ui/*\"]" \
-s "webOrigins=[\"http://localhost:3000\", \"/\"]"
```

> `$MTA_HOME` represents the folder where MTA Web Console is running.

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
