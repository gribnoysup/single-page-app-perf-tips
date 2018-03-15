const prompts = require('prompts');
const git = require('simple-git/promise');

const logger = require('./utils/logger');

const unique = array => [...new Set(array)];

const update = async () => {
  logger.process('Checking for updates');

  const summary = await git().fetch(['--dry-run']);

  if (Array.isArray(summary.tags) && summary.tags.length > 0) {
    logger.process.succeed(`Found changes in remote`);

    const tags = unique(summary.tags.map(tag => tag.name)).join(', ');

    const { shouldUpdate } = await prompts({
      type: 'confirm',
      name: 'shouldUpdate',
      message: `Found new tag(s) in the origin: ${tags}. Do yo want to update local?`,
      initial: true,
    });

    if (shouldUpdate) {
      logger.process('Fetching origin');

      await git().fetch();

      logger.process.succeed('Updated local');
    }
  } else {
    logger.process.succeed('Local is up to date');
  }
};

module.exports = update;
