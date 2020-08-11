<!doctype html>
<html>
<head>
    <title>Migration Toolkit for Applications Web Console(MTA)</title>
    <base href="${basePath}">
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="img/mta-icon.png" rel="shortcut icon" type="image/x-icon"/>
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

<body>
<windup-app>
    <div class="pf-c-page">
        <header class="pf-c-page__header">
            <div class="pf-c-page__header-brand">
                <div class="pf-c-page__header-brand-toggle">
                    <button class="pf-c-button pf-m-plain"
                            type="button"
                            aria-label="Global navigation" aria-expanded="true"
                            aria-controls="page-default-nav-example-primary-nav">
                        <i class="fas fa-bars" aria-hidden="true"></i>
                    </button>
                </div>
                <a class="pf-c-page__header-brand-link">
                    <img class="pf-c-brand" src="img/mta-logo-header.svg" alt="Logo"/>
                </a>
            </div>
        </header>
        <main class="pf-c-page__main" tabindex="-1" id="main-content-page-default-nav-example">
            <section class="pf-c-page__main-section">
                <div class="pf-l-bullseye">
                    <div class="pf-l-bullseye__item">
                        <div className="pf-u-display-flex pf-u-flex-direction-column">
                            <div>
                                <span class="pf-c-spinner" role="progressbar" aria-valuetext="Loading...">
                                    <span class="pf-c-spinner__clipper"></span>
                                    <span class="pf-c-spinner__lead-ball"></span>
                                    <span class="pf-c-spinner__tail-ball"></span>
                                </span>
                            </div>
                            <div className="pf-c-content">
                                <h3>Loading...</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    </div>

</windup-app>
</body>
</html>
