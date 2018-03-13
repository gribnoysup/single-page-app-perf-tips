const prompts = require('prompts');
const git = require('simple-git/promise');

const logger = require('./logger');

const update = async () => {
  logger.process('Checking for updates');

  const summary = await git().fetch(['--dry-run', '--quiet']);

  logger.process.succeed();

  if (Array.isArray(summary.tags) && summary.tags.length > 0) {
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
  }
};

module.exports = update;
