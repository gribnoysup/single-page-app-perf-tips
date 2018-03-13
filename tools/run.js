const path = require('path');

const mri = require('mri');
const prompts = require('prompts');
const chalk = require('chalk');

const logger = require('./logger');
const commands = require('./commands');

const parsed = mri(process.argv.slice(2));

const availableCommands = commands.map(command => command.name).join(', ');

const appFolder = 'application';

const main = (_, args) => {
  const command = commands.find(command => command.name === _);

  if (!command) {
    logger.error(
      (_ ? `Unexpected command "${_}"` : 'No command provided') +
        `. Available command(s): ${chalk.bold(availableCommands)}`
    );

    process.exitCode = 1;
    process.exit();
  }

  try {
    const pathToScript = path.resolve(__dirname, command.name + '.js');
    return require(pathToScript)([], args);
  } catch (e) {
    logger.process.fail();

    const errorMessage =
      `Somethig bad happened while running "${command.name}" command:\n\n` +
      (Array.isArray(e.errors) && e.errors.length > 0
        ? e.errors.join('\n')
        : e.stack || e.message || e);

    logger.error(errorMessage);
    logger.n();

    process.exitCode = 1;
    process.exit();
  }
};

main(parsed._[0], parsed);
