const path = require('path');

const fs = require('fs-extra');
const git = require('simple-git/promise');

const logger = require('./logger');
const { getPathToApp, rootPath, repoPath } = require('./utils/paths');

const b = require('chalk').bold;

const fetch = async project => {
  const appDir = getPathToApp(project);
  const tmpDir = path.join(rootPath, 'tmp', `.${project}`);

  logger.process(`Checking if ${b(project)} already exists`);

  if (await fs.pathExists(appDir)) {
    logger.process.succeed('Application already exists');
    return;
  }

  logger.process(`Cloning ${b(project)} to ${b(tmpDir)}`);

  await git().clone(repoPath, tmpDir);

  logger.process(`Moving ${b(project)} application code to ${b(appDir)}`);

  await fs.move(path.join(tmpDir, 'application'), appDir);

  logger.process('Cleaning up');

  await fs.remove(tmpDir);

  logger.process.succeed(
    `Application ${b(project)} is available in ${b(appDir)}`
  );
};

module.exports = fetch;
