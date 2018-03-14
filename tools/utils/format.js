const chalk = require('chalk');

const format = project => chalk.gray(`[${project}]`);

module.exports = format;
