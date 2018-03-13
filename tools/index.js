'use strict';

var chalk = require('chalk');
var major = process.versions.node.split('.')[0];

if (major < 8) {
  // eslint-disable-next-line no-console
  console.error(
    chalk.yellow(
      '⚠ You are using Node ' +
        chalk.bold('v' + process.versions.node) +
        '\n  This sandbox requires Node ' +
        chalk.bold('8 or higher') +
        '. Please update your version of Node.'
    )
  );

  process.exitCode = 1;
  process.exit();
}

require('./run');
