<html>
<head>
    <title>Windup 3.0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- PatternFly Styles -->
    <!-- Note: No other CSS files are needed regardless of what other JS packages located in patternfly/components that you decide to pull in -->
    <link rel="stylesheet" href="node_modules/patternfly/dist/css/patternfly.min.css">
    <link rel="stylesheet" href="node_modules/patternfly/dist/css/patternfly-additions.min.css">
    <link rel="stylesheet" href="css/windup-web.css">

    <!-- jQuery -->
    <script src="node_modules/jquery/dist/jquery.min.js"></script>

    <!-- Bootstrap JS -->
    <script src="node_modules/bootstrap/dist/js/bootstrap.min.js"></script>

    <script src="${keycloak.serverUrl}/js/keycloak.js"></script>

    <script>
        $(function() {
            var keycloak = new Keycloak('keycloak.json');
            keycloak.init({ onLoad: 'check-sso' }).success(function(authenticated) {
                if (authenticated) {
                    window.location.href = "authenticated.jsp";
                } else {
                    $('#loading').hide();
                    $('#loginRequired').show();
                }
            }).error(function(error) {
                console.log("Error checking authentication due to: " + error);
            });

            $('#btnLogin').click(function () {
                keycloak.init({ onLoad: 'login-required' }).success(function(authenticated) {
                    if (authenticated)
                        window.location.href = "authenticated.jsp";
                });
            });
        });
    </script>
</head>

<body>
    <div id="loading" class="blank-slate-pf">
        <h1>
            Checking Authentication...
        </h1>
    </div>

    <div id="loginRequired" class="blank-slate-pf" style="display: none;">
        <h1>
            Windup Login Required
        </h1>
        <div class="blank-slate-pf-main-action">
            <a id="btnLogin" href="#" class="btn btn-primary btn-lg">Click here to Login</a>
        </div>

        <div>
            Learn more about Windup installation <a href="https://github.com/windup/windup-web/blob/master/README.md">from the documentation</a>.
        </div>
    </div>
</body>

</html>
