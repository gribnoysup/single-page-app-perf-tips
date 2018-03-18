const path = require('path');

const fs = require('fs-extra');
const b = require('chalk').bold;
const git = require('simple-git/promise');

const logger = require('./utils/logger');
const f = require('./utils/format');
const {
  getProjectDir,
  rootDir,
  repoPath,
  tmpFolder,
} = require('./utils/paths');

const fetch = async (project, { overwrite = false } = {}) => {
  const appDir = getProjectDir(project);
  const tmpDir = path.join(rootDir, tmpFolder, `.${project}`);

  if (overwrite === true) {
    if (await fs.pathExists(appDir)) {
      logger.process(
        `${f(project)} Application already exists. Removing folder`
      );
      await fs.remove(appDir);
    }
  } else {
    logger.process(`${f(project)} Checking if application already exists`);

    if (await fs.pathExists(appDir)) {
      logger.process.succeed(`${f(project)} Application already exists`);
      return;
    }
  }

  logger.process(`${f(project)} Cloning repository to ${b(tmpDir)}`);

  await git().clone(repoPath, tmpDir);
  await git(tmpDir).checkout(project);

  logger.process(`${f(project)} Moving application code to ${b(appDir)}`);

  await fs.move(path.join(tmpDir, 'application'), appDir);

  logger.process(`${f(project)} Cleaning up`);

  await fs.remove(tmpDir);

  logger.process.succeed(
    `${f(project)} Application is available in ${b(appDir)}`
  );
};

module.exports = fetch;
