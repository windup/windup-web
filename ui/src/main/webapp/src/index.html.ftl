<html class="layout-pf layout-pf-fixed transitions">
<head>
    <title>Windup 3.0</title>
    <base href="/windup-web/">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="${keycloak.serverUrl}/js/keycloak.js"></script>

    <script>
        // this is here so that AbstractUITest can tell we are loading the actual app
        window['mainApp'] = true;
        window['windupConstants'] = {
            'SERVER': '${serverUrl}',
            'SSO_MODE': 'check-sso'
        };
    </script>

</head>

<body class="cards-pf">
<windup-app>
    <div id="loading" class="blank-slate-pf">
        <h1>
            Loading...
        </h1>
    </div>
</windup-app>
</body>

</html>
