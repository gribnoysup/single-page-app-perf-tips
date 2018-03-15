const chalk = require('chalk');

module.exports = [
  {
    name: 'update',
    type: null,
  },
  {
    name: 'fetch',
    type: 'multiselect',
    message: 'Which applications do you want to fetch?',
    excludeCurrent: true,
  },
  {
    name: 'clear',
    type: 'multiselect',
    message: 'Which applications do you want to clear?',
    excludeCurrent: false,
  },
  {
    name: 'build',
    type: 'multiselect',
    message: 'Which applications do you want to build?',
    excludeCurrent: false,
  },
  {
    name: 'start',
    type: 'select',
    message: 'Which application do you want to start?',
    excludeCurrent: false,
  },
  {
    name: 'measure',
    type: 'multiselect',
    message: 'Which applications do you want to measure?',
    excludeCurrent: false,
  },
  {
    name: 'print-metrics',
    type: 'select',
    message: 'For which application do you want to see the metrics?',
    excludeCurrent: false,
  },
  {
    name: 'compare',
    type: 'multiselect',
    message: 'Which application do you want to compare?',
    hint: `${chalk.grey('Select')} ${chalk.bold.white('two')} ${chalk.grey(
      'applications. Space to select. Return to submit'
    )}`,
    multi: true,
    excludeCurrent: false,
    max: 2,
  },
];
