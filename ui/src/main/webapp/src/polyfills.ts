import 'core-js/client/shim';
import 'reflect-metadata';
require('zone.js/dist/zone');

import 'ts-helpers';

// Intl API required for PhantomJS and some browsers
import 'intl';
import 'intl/locale-data/jsonp/en';

declare var process: any;

if (process.env.ENV === 'build') {
  // Production
} else {
  // Development
  Error['stackTraceLimit'] = Infinity;

  require('zone.js/dist/long-stack-trace-zone');
}
