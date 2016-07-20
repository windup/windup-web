(function(global) {
    //map tells the System loader where to look for things
    var  map = {
        'app':                        'app',
        'unmarshaller':               'unmarshaller',
    };

    //packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        'unmarshaller':               { main: 'main.js',  defaultExtension: 'js' },
        'tests/unmarshaller':               { main: 'main.js',  defaultExtension: 'js' },
        'unmarshallerTest':           { main: 'GraphJSONtoTsModelsService.js',  defaultExtension: 'js' },
        '../../app':                  { main: 'main.js',  defaultExtension: 'js' },
        '../app':                     { main: 'main.js',  defaultExtension: 'js' },
        '../../unmarshaller':                  { main: 'main.js',  defaultExtension: 'js' },
        '../unmarshaller':                     { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' },
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/upgrade',
        'symbol-observable'
    ];

    packageNames.forEach(function(pkgName) {
        // add map entries for angular packages in the form '@angular/common': 'https://npmcdn.com/@angular/common@0.0.0-3?main=browser'
        map[pkgName] = pkgName;
        // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        paths: {
            'app': '',
            'unmarshallerTest': 'app/services/graph',
            // These are for unit-tests.html
            'tests/app/*': "app/*",
            'tests/unmarshaller/*': "unmarshaller/*",
            '*': '/windup-web/node_modules/*'
        },
        packages: packages
    };

    System.config(config);

})(this);
