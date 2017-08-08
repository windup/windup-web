<html class="layout-pf layout-pf-fixed transitions">
<head>
    <title>Tinkerpop Graph Tool</title>
    <base href="${basePath}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="${keycloak.serverUrl}/js/keycloak.js"></script>
    <script src="version/version.properties.js"></script>

    <script>
        // this is here so that AbstractUITest can tell we are loading the actual app
        window['mainApp'] = true;
        window['windupConstants'] = {
            'SERVER': '${serverUrl}',
            'REST_SERVER': '${serverUrl}',
            'REST_BASE': '${apiServerUrl}',
            'GRAPH_REST_BASE': '${graphApiServerUrl}',
            'STATIC_REPORTS_BASE': '${staticReportServerUrl}',
            'SSO_MODE': 'login-required'
        };
    </script>

</head>

<body class="cards-pf">
    <graph-tool-app>
        <h1>
            Loading...
        </h1>
    </graph-tool-app>
</body>
</html>
