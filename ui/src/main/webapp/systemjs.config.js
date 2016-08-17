(function(global) {
    //map tells the System loader where to look for things
    var  map = {
        'app':                        'app'
    };

    //packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app':                        { main: 'main.js',  defaultExtension: 'js' },
        '../../app':                  { main: 'main.js',  defaultExtension: 'js' },
        '../app':                     { main: 'main.js',  defaultExtension: 'js' },
        'rxjs':                       { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' },
    };

    var packageNames = [
        '@angular/common',
        '@angular/compiler',
        '@angular/core',
        '@angular/forms',
        '@angular/http',
        '@angular/platform-browser',
        '@angular/platform-browser-dynamic',
        '@angular/router',
        '@angular/router-deprecated',
        '@angular/upgrade',
        'symbol-observable'
    ];

    // add map entries for angular packages in the form '@angular/common': 'https://npmcdn.com/@angular/common@0.0.0-3?main=browser'
    packageNames.forEach(function(pkgName) {
        map[pkgName] = pkgName;
    });

    // add package entries for angular packages in the form '@angular/common': { main: 'index.js', defaultExtension: 'js' }
    packageNames.forEach(function(pkgName) {
        packages[pkgName] = { main: 'index.js', defaultExtension: 'js' };
    });

    var config = {
        map: map,
        paths: {
            'app': '',
            'tests/app/*': "app/*",
            '*': '/windup-web/node_modules/*'
        },
        packages: packages
    };

    System.config(config);

})(this);
