const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const fs = require('fs-extra');
const prompts = require('prompts');
const chalk = require('chalk');

const fetch = require('./fetch');
const clear = require('./clear');

const logger = require('./utils/logger');
const isNonEmptyDir = require('./utils/isNonEmptyDir');
const { getProjectDir } = require('./utils/paths');
const f = require('./utils/format');

const execAsync = promisify(exec);

const build = async (
  project,
  {
    stdio = 'ignore',
    failOnError = false,
    fresh = false,
    useBaseConfig = false,
  } = {}
) => {
  if (project !== 'current') {
    await fetch(project);
  }

  if (fresh === true) {
    await clear(project);
  }

  const projectDir = getProjectDir(project);

  const execOptions = {
    stdio,
    env: Object.assign({}, process.env),
    windowsHide: true,
    cwd: projectDir,
  };

  let shouldInstallNpmDeps = true;

  if (await isNonEmptyDir(path.join(projectDir, 'node_modules'))) {
    const message = `${f(
      project
    )} Seems like application dependencies are already installed. Do you want to reinstall them?`;

    const { shouldInstall } = await prompts({
      message,
      type: 'confirm',
      name: 'shouldInstall',
      initial: false,
    });

    if (shouldInstall === true) {
      await clear(project, { folders: ['node_modules'] });
    } else {
      logger.info(`${f(project)} Skipping node_modules install`);
    }

    shouldInstallNpmDeps = shouldInstall;
  }

  if (shouldInstallNpmDeps === true) {
    logger.process.fresh(`${f(project)} Installing application dependencies`);
    await execAsync('npm install --loglevel error', execOptions);
    logger.process.succeed();
  }

  const webpackConfigFiles = (await fs.readdir(projectDir)).filter(fileName =>
    /^webpack\.config\./.test(fileName)
  );

  const baseConfigName = 'webpack.config.js';

  if (webpackConfigFiles.length > 0) {
    await clear(project, { folders: ['build'] });

    let configName;

    if (useBaseConfig === true && webpackConfigFiles.includes(baseConfigName)) {
      configName = baseConfigName;
    } else if (webpackConfigFiles.length === 1) {
      configName = webpackConfigFiles[0];
    } else {
      const len = webpackConfigFiles.length;
      const message = `${f(
        project
      )} Found ${len} webpack configs. Which one do you want to use?`;

      const { selectedConfig } = await prompts({
        message,
        type: 'select',
        name: 'selectedConfig',
        choices: webpackConfigFiles
          .map(file => ({ title: file, value: file }))
          .sort((_, b) => b.title === baseConfigName),
        initial: 0,
      });

      if (!selectedConfig) {
        return;
      }

      configName = selectedConfig;
    }

    const webpackPath = path.join(projectDir, 'node_modules', 'webpack');
    const webpackConfig = require(path.join(projectDir, configName));
    const webpackAsync = promisify(require(webpackPath));

    logger.process.fresh(
      `${f(project)} Building application ${chalk.gray(
        '(NODE_ENV=' + process.env.NODE_ENV + ')'
      )}`
    );

    const stats = await webpackAsync(webpackConfig);

    const stringified = stats.toString({
      children: false,
      modules: false,
      colors: true,
    });

    logger.process.succeed();

    logger.n();
    logger.log(stringified);
    logger.n();
  } else {
    const message = `No webpack.config.* files found for ${chalk.bold(
      project
    )}`;

    if (failOnError === true) {
      throw new Error(message);
    } else {
      logger.error(message);
    }
  }
};

module.exports = build;
