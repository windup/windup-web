<html class="layout-pf layout-pf-fixed transitions">
<head>
    <title>Red Hat Application Migration Toolkit Web Console (RHAMT)</title>
    <base href="${basePath}">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="img/rhamt-icon-128.png" rel="shortcut icon" type="image/x-icon"/>
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

    <style>
        @media (min-width: 992px) {
            pfng-toast-notification .toast-pf {
                max-width: 70%;
            }
        }
    </style>
</head>

<body class="cards-pf">
<windup-app> <!--  -->

    <style>
        .navbar {
            width: 100%;
            background-clip: border-box;
            background-color: rgb(3, 3, 3);
            background-origin: padding-box;
            border-color: rgb(54, 54, 54);
            box-sizing: border-box;
            color: rgb(54, 54, 54);
            display: block;
            font-family: "Open Sans", Helvetica, Arial, sans-serif;
            font-size: 12px;
            height: 60px;
            line-height: 20px;
            position: fixed;
            z-index: 1030;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        #header-logo-wrapper {
            box-sizing: border-box;
            color: rgb(209, 209, 209);
            display: block;
            font-family: "Open Sans", Helvetica, Arial, sans-serif;
            font-size: 18px;
            height: 60px;
            line-height: 60px;
            padding-left: 30px;
            width: 100%;
            vertical-align: middle;
        }
        #header-logo strong {
            text-transform: uppercase;
            color: #d1d1d1;
        }

        .blank-slate-pf { border: none !important; }
    </style>

    <div class="navbar">
        <div class="collapse navbar-collapse navbar-collapse-1">
            <div id="header-logo-wrapper">
                <div id="header-logo"><strong>Red Hat Application Migration Toolkit</strong>&nbsp;Web Console
                    <!-- a class="pointer link" target="_blank" href="https://developers.redhat.com/products/rhamt/overview/" style="color: #ff0000">(Beta)</a -->
                </div>
            </div>
        </div>
    </div>

    <div id="loading" class="blank-slate-pf">
        <h1>
            Loading...
        </h1>
    </div>

</windup-app>
</body>
</html>
