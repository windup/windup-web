// Angular 2
import "@angular/platform-browser";
import "@angular/platform-browser-dynamic";
import "@angular/core";
import "@angular/common";
import "@angular/http";
import "@angular/router";

import "rxjs";
import "@angularclass/hmr";

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

// js
require('../node_modules/jquery/dist/jquery');
require('../node_modules/bootstrap/dist/js/bootstrap');

require('../node_modules/datatables/media/js/jquery.dataTables.min.js');
require('../node_modules/drmonty-datatables-colvis/js/dataTables.colVis.min.js');
require('../node_modules/datatables-colreorder/js/dataTables.colReorder.js');

require('../node_modules/patternfly/dist/js/patternfly.min');

require('../node_modules/patternfly-bootstrap-combobox/js/bootstrap-combobox.js');

require('../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js');
require('../node_modules/bootstrap-select/dist/js/bootstrap-select.min.js');
require('../node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js');
require('../node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js');
require('../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min.js');

require('../node_modules/google-code-prettify/bin/prettify.min.js');
require('../node_modules/jquery-match-height/dist/jquery.matchHeight-min.js');

require('../node_modules/core-js/client/shim.min.js');
require('../node_modules/reflect-metadata/Reflect.js');


// css
require('../css/windup-web.css');
require('../node_modules/patternfly/dist/css/patternfly.min.css');
require('../node_modules/patternfly/dist/css/patternfly-additions.min.css');


require('./keycloak.json');
