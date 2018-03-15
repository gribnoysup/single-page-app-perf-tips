const path = require('path');
const { fork } = require('child_process');

const b = require('chalk').bold;

const build = require('./build');
const logger = require('./utils/logger');
const isBuildExists = require('./utils/isBuildExists');
const { getProjectDir } = require('./utils/paths');
const f = require('./utils/format');

const forkAsync = (path, args, options, returnSubprocess = false) => {
  return new Promise(resolve => {
    const subprocess = fork(path, args, options);
    if (returnSubprocess === true) {
      resolve(subprocess);
    } else {
      subprocess.on('close', resolve);
    }
  });
};

const start = async (
  project,
  {
    stdio = 'inherit',
    returnSubprocess = false,
    failOnError = false,
    dev = false,
  } = {}
) => {
  const projectDir = getProjectDir(project);

  if (!await isBuildExists(projectDir)) {
    logger.warn(
      `${f(
        project
      )} It seems that build is not complete. Bootstrapping application.`
    );
    await build(project, { failOnError: true });
  }

  const packageJSON = require(path.join(projectDir, 'package.json'));

  const forkOptions = {
    stdio,
    cwd: projectDir,
    env: Object.assign({}, process.env),
    windowsHide: true,
  };

  if (packageJSON.main) {
    return forkAsync(
      packageJSON.main,
      [].concat(dev === true ? '--dev' : []),
      forkOptions,
      returnSubprocess
    );
  } else {
    const message = `No main file found in package.json of ${b(project)}`;

    if (failOnError === true) {
      throw new Error(message);
    } else {
      logger.error(message);
    }
  }
};

module.exports = start;
