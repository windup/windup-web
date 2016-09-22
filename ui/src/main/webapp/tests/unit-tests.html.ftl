<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="content-type" content="text/html;charset=utf-8">
    <title>Ng App Unit Tests</title>

    <link rel="stylesheet" href="../node_modules/jasmine-core/lib/jasmine-core/jasmine.css">
    <script src="../node_modules/jasmine-core/lib/jasmine-core/jasmine.js"></script>
    <script src="../node_modules/jasmine-core/lib/jasmine-core/jasmine-html.js"></script>
    <script src="../node_modules/jasmine-core/lib/jasmine-core/boot.js"></script>

    <!-- Load and Configure SystemJS -->
    <script src="../node_modules/core-js/client/shim.min.js"></script>
    <script src="../node_modules/systemjs/dist/system.js"></script>

    <!-- Load Angular 2 -->

    <script src="../node_modules/reflect-metadata/Reflect.js"></script>

    <!-- Needed for tests -->
    <script src="../node_modules/zone.js/dist/zone.min.js"></script>
    <script src="../node_modules/zone.js/dist/long-stack-trace-zone.js"></script>
    <script src="../node_modules/zone.js/dist/proxy.js"></script>
    <script src="../node_modules/zone.js/dist/sync-test.js"></script>
    <script src="../node_modules/zone.js/dist/jasmine-patch.js"></script>
    <script src="../node_modules/zone.js/dist/"></script>
    <script src="../node_modules/zone.js/dist/"></script>
    <script src="../node_modules/zone.js/dist/async-test.js"></script>
    <script src="../node_modules/zone.js/dist/fake-async-test.js"></script>

    <script src="${keycloak.serverUrl}/js/keycloak.js"></script>

    <script>
        var SPEC_FILES = [
            'tests/app/file.service.spec',
            'tests/app/registeredapplication.model.spec',
            'tests/app/registeredapplication.service.spec',
            'tests/app/unmarshaller.spec',
        ];

        function success () {
            console.log('Spec files loaded; starting Jasmine testrunner');
            window.onload();
        }

        function getQueryParams(qs) {
            if (qs === void 0)
                qs = document.location.search;
            qs = qs.split('+').join(' ');
            var params = {}, tokens, re = /[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs))
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            return params;
        }
            
        function escapeRegExp(str) {
            return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        }
            
        var params = getQueryParams();
        // .../unit-tests.html?specs=
        var runSpecs = (!params["specs"]) ? null : runSpecs = params.split(",");
        if (runSpecs != null) {
	    var specsRegex = new RegExp(runSpecs.map(escapeRegExp).join("|"));
	    SPEC_FILES = SPEC_FILES.filter(function(spec){
	    return specsRegex.test(spec);
	    })
	}

        System.import('../systemjs.config.js')
            .then(function () {
                return System.import('tests/app/servicesetup');
            })
            .then(function () {
                return Promise.all([
                    System.import('@angular/core/testing'),
                    System.import('@angular/platform-browser-dynamic/testing')
                ])
            })

            .then(function (providers) {
                var testing = providers[0];
                var testingBrowser = providers[1];

                testing.TestBed.initTestEnvironment(
                        testingBrowser.BrowserDynamicTestingModule,
                        testingBrowser.platformBrowserDynamicTesting());
            })

            // Import the spec files defined in the html (__spec_files__)
            .then(function () {
                console.log('Loading test spec files: '+SPEC_FILES.join(', '));
                return Promise.all(
                    SPEC_FILES.map(function(spec) {
                        return System.import(spec);
                    })
                );
            })

            //  After all imports load,  re-execute `window.onload` which
            //  triggers the Jasmine test-runner start or explain what went wrong
            .then(success, console.error.bind(console));
    </script>
</head>
<body>
</body>
</html>