<html class="layout-pf layout-pf-fixed transitions">
<head>
    <title>Red Hat Application Migration Toolkit Web Console (RHAMT)</title>
    <base href="${basePath}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="${keycloak.serverUrl}/js/keycloak.js"></script>

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
<windup-app>

    <style>
        .navbar {
            background-attachment: scroll;
            background-clip: border-box;
            background-color: rgb(3, 3, 3);
            background-image: none;
            background-origin: padding-box;
            background-position-x: 0%;
            background-position-y: 0%;
            background-repeat-x:;
            background-repeat-y:;
            background-size: auto;
            border-bottom-color: rgb(54, 54, 54);
            border-bottom-left-radius: 0px;
            border-bottom-right-radius: 0px;
            border-bottom-style: none;
            border-bottom-width: 0px;
            border-image-outset: 0px;
            border-image-repeat: stretch;
            border-image-slice: 100%;
            border-image-source: none;
            border-image-width: 1;
            border-left-color: rgb(54, 54, 54);
            border-left-style: none;
            border-left-width: 0px;
            border-right-color: rgb(54, 54, 54);
            border-right-style: none;
            border-right-width: 0px;
            border-top-color: rgb(54, 54, 54);
            border-top-left-radius: 0px;
            border-top-right-radius: 0px;
            border-top-style: none;
            border-top-width: 0px;
            box-sizing: border-box;
            color: rgb(54, 54, 54);
            display: block;
            font-family: "Open Sans", Helvetica, Arial, sans-serif;
            font-size: 12px;
            height: 60.8px;
            left: 0px;
            line-height: 20px;
            margin-bottom: 0px;
            min-height: 0px;
            position: fixed;
            right: 0px;
            text-size-adjust: 100%;
            top: 0px;
            width: 1809.6px;
            z-index: 1030;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        #header-logo-wrapper {
            box-sizing: border-box;
            color: rgb(209, 209, 209);
            cursor: auto;
            display: block;
            font-family: "Open Sans", Helvetica, Arial, sans-serif;
            font-size: 18px;
            height: 60px;
            line-height: 60px;
            padding-left: 30px;
            text-size-adjust: 100%;
            width: 1809.6px;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        }
        #header-logo-wrapper a {
            font-size: 18px;
            vertical-align: middle;
            line-height: 60px;
            color: #d1d1d1;
        }
        #header-logo {
            text-transform: uppercase;
        }

        .blank-slate-pf { border: none !important; }
    </style>

    <div class="navbar">
        <div class="collapse navbar-collapse navbar-collapse-1">
            <div id="header-logo-wrapper">
                <a>
                    <div id="header-logo"><strong>Red Hat Application Migration Toolkit</strong> - Web Console</div>
                </a>
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
