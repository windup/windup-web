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
      return require('./config/webpack.prod');
      break;
    case 'test':
    case 'testing':
      return  require('./config/webpack.test');
      break;
    case 'dev':
    case 'development':
    default:
      return require('./config/webpack.dev');
    break;
  }
};
