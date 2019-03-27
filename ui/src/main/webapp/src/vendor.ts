import * as $ from 'jquery';

// Stupid workaround for jQuery
// Some jQuery modules require jQuery to be global variable
// But some of them (and jQuery itself) already support UMD
// So jQuery must be manually registered as global variable and webpack must be forced to load those modules
// into global scope in webpack config
window['jQuery'] = $;
window['$'] = $;

// D3
/*
TODO: This has been disabled for release without reports

import 'd3';
import 'd3-selection-multi';
*/

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

// js
require('../node_modules/bootstrap/dist/js/bootstrap');

/*
 TODO: This has been disabled for release without reports
require('../node_modules/datatables/media/js/jquery.dataTables');
require('../node_modules/datatables/media/css/jquery.dataTables.min.css');

require('../node_modules/drmonty-datatables-colvis/js/dataTables.colVis');
require('../node_modules/datatables-colreorder/js/dataTables.colReorder.js');
*/

require('../node_modules/patternfly/dist/js/patternfly.min');

require('../node_modules/patternfly-bootstrap-combobox/js/bootstrap-combobox.js');

require('../node_modules/bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js');
require('../node_modules/bootstrap-select/dist/js/bootstrap-select.min.js');
require('../node_modules/bootstrap-switch/dist/js/bootstrap-switch.min.js');
require('../node_modules/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js');
require('../node_modules/bootstrap-treeview/dist/bootstrap-treeview.min.js');
require('../node_modules/jquery-match-height/dist/jquery.matchHeight-min.js');

require('../node_modules/jstree/dist/jstree');
require('../node_modules/jstree/dist/themes/default/style.min.css');

// css
require('../node_modules/patternfly/dist/css/patternfly.min.css');
require('../node_modules/patternfly/dist/css/patternfly-additions.min.css');
require('../node_modules/patternfly-ng/dist/css/patternfly-ng.min.css');

// Google Code Prettify
require('../node_modules/google-code-prettify/bin/prettify.min.js');
require('../node_modules/google-code-prettify/bin/prettify.min.css');


// Prism
require('../node_modules/prismjs/prism');
require('../node_modules/prismjs/themes/prism.css');

// chosen
require('../css/chosen/chosen.css');

require('../node_modules/font-awesome/css/font-awesome.css');
