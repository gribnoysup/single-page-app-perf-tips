/* eslint-disable no-console */

const ora = require('ora');
const chalk = require('chalk');

const formatMessage = (prefix, type, color = _ => _) => message => {
  const [first, ...next] = message.split('\n');
  console[type](color(`${prefix} ${first}`));
  next.forEach(line => console[type](color(`  ${line}`)));
};

let running = false;
const spinner = ora();

function processLogger(message) {
  running = true;
  spinner.start(message);
}

function succeed(message) {
  if (running) {
    running = false;
    spinner.succeed(message);
  }
}

function fail(message) {
  if (running) {
    running = false;
    spinner.fail(message);
  }
}

function fresh(message, oldMessage) {
  if (running) succeed(oldMessage);
  processLogger(message);
}

processLogger.fresh = fresh;
processLogger.succeed = succeed;
processLogger.fail = fail;

module.exports = {
  n: () => console.log(),
  noformat: (...args) => console.log(...args),
  log: formatMessage(' ', 'log', chalk.gray),
  info: formatMessage('ℹ', 'info', chalk.cyan),
  warn: formatMessage('⚠', 'warn', chalk.yellow),
  error: formatMessage('⨯', 'error', chalk.red),
  process: processLogger,
};
