const prompts = require('prompts');
const git = require('simple-git/promise');

const logger = require('./utils/logger');

const update = async () => {
  logger.process('Checking for updates');

  const summary = await git().fetch(['--dry-run']);

  if (Array.isArray(summary.tags) && summary.tags.length > 0) {
    logger.process.succeed(`Found changes in remote`);

    const tags = summary.tags.map(tag => tag.name).join(', ');

    const { shouldUpdate } = await prompts({
      type: 'confirm',
      name: 'shouldUpdate',
      message: `Found new tags in the origin: ${tags}. Do yo want to update local?`,
      initial: true,
    });

    if (shouldUpdate) {
      logger.process('Fetching origin');

      await git().fetch();

      logger.process.succeed();
    }
  } else {
    logger.process.succeed('Local is up to date');
  }
};

module.exports = update;
