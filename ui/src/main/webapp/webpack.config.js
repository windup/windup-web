module.exports = function(environment) {
  var mode;

  if (environment && environment.hasOwnProperty('environment')) {
    mode = environment.environment;
  } else {
    mode = process.env.NODE_ENV;
  }

  switch (mode) {
    case 'prod':
    case 'production':
      console.info('Running webpack in production mode');
      return require('./config/webpack.prod');
      break;
    case 'test':
    case 'testing':
      console.info('Running webpack in test mode');
      return require('./config/webpack.test');
      break;
    case 'dev':
    case 'development':
    default:
      console.info('Running webpack in dev mode');
      return require('./config/webpack.dev');
    break;
  }
};
