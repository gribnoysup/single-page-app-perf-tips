const path = require('path');

const mri = require('mri');
const prompts = require('prompts');
const chalk = require('chalk');
const git = require('simple-git/promise');

const logger = require('./utils/logger');
const commands = require('./commands');

const parsed = mri(process.argv.slice(2));

const availableCommands = commands.map(command => command.name).join(', ');

const currentAppOption = {
  title: 'current application',
  value: 'current',
};

const main = async (_, args) => {
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

    if (command.type === null) {
      return await require(pathToScript)(args);
    } else {
      const { all: tags } = await git().tags();
      const choices = tags.map(tagName => ({ value: tagName, title: tagName }));

      if (command.excludeCurrent !== true) {
        choices.unshift(currentAppOption);
      }

      const { applications } = await prompts({
        choices,
        type: command.type,
        message: command.message,
        name: 'applications',
        hint: command.hint,
        max: command.max,
      });

      const script = require(pathToScript);

      if (Array.isArray(applications) && applications.length > 0) {
        if (command.multi === true) {
          return await script(applications, args);
        }

        for (const application of applications) {
          await script(application, args);
        }

        return;
      } else if (applications) {
        return await script(applications, args);
      }
    }
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
